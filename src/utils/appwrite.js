import { Client, Account, Databases, Query  } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID) // Your project ID
    .setEndpointRealtime('wss://cloud.appwrite.io/v1/realtime');


    export const account = new Account(client);
export const databases = new Databases(client);

export { client , Query};