import { Client, Account, Databases} from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('6728fa3100246b2a73c9') // Your project ID
   .setEndpointRealtime('wss://cloud.appwrite.io/v1/realtime');
    export const account = new Account(client);
    export const databases = new Databases(client);

    export { client };