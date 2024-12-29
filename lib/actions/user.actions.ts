'use server'
import { Query , ID} from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appWriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";

const getUserByEmail = async (email: string) => {
    const {databases} = await createAdminClient();
    const result = await databases.listDocuments(appWriteConfig.databaseId,appWriteConfig.usersCollectionId,[Query.equal( 'email', [email])]); //Check this once again for any error if something interrups 
    // const result = await databases.listDocuments(appWriteConfig.databaseId,appWriteConfig.usersCollectionId,queries:[Query.equal( attribute:'email',values: [email])]); //Check this once again for any error if something interrups 
    return result.total >0 ? result.documents[0] : null;
}

const handleError = (error: unknown , message:string) => {
    console.error(message, error);
    throw error;
};

const sendEmailOTP = async ({email} : {email: string}) => {
    const account = await createAdminClient();

    try {
        const session = await account.account.createEmailToken(ID.unique(),email);
        return session.$id;

    } catch (error) {
        handleError(error, "Failed to send email OTP");   
    }
};
export const createAccount = async ({fullName, email} : {fullName: string; email:string; }) => {
    
    const existingUser = await getUserByEmail(email);
    const accountId = await sendEmailOTP({email});

    if(!accountId){
        throw new Error("Failed to send email OTP");
    }
    if(existingUser){

        const {databases} = await createAdminClient();
        await databases.createDocument(appWriteConfig.databaseId,appWriteConfig.usersCollectionId,ID.unique(),{fullName,email,avatar:"http://whatsappdpwoorld.blogspot.com/2016/09/mom-says-no-dp.html",accountId});
    }
    return parseStringify({accountId});
}