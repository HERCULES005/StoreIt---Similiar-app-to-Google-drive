'use server'
//!Node appwrite decay so all of the services will be used on server side

import {Account, AppwriteException, Avatars, Client, Databases, Messaging, Storage} from "node-appwrite";
import { appWriteConfig } from "./config";
import { cookies } from "next/headers";
import { get } from "http";

export const createSessionClient = async () =>{
    const client  = new Client().setEndpoint(appWriteConfig.endpointUrl).setProject(appWriteConfig.projectId);
    const session = (await cookies()).get('appwrite-session');
    // const session = (await cookies()).get(args: 'appwrite-session');

    if (!session || !session.value) throw new Error("No session")

    client.setSession(session.value)
    
    return{
        get account(){
            return new Account(client)
        },
        get databases(){
            return new Databases(client)
        }
    }
    
};

//!Admin level client
export const createAdminClient = async () =>{
    //create admin level permissions like managing databases etc
    const client  = new Client().setEndpoint(appWriteConfig.endpointUrl).setProject(appWriteConfig.projectId).setKey(appWriteConfig.secretKey);
    
    return{
        get account(){
            return new Account(client)
        },
        get databases(){
            return new Databases(client)
        },
        get avatars(){
            return new Avatars(client)
        },
        get storage(){
            return new Storage(client)
        }
    }
}