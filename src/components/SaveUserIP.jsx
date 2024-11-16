import { useEffect } from 'react';
import { account, databases } from '../utils/appwrite'; 

const SaveUserIP = () => {

  useEffect(() => {
    const saveUserIP = async () => {
      try {
 
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ipAddress = ipData.ip;

        console.log(ipAddress);
        
        const user = await account.get(); 
        const userName = user.name || 'Guest'; 

        
        await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            '672bad700039da93b24e',
          'unique()', 
          {
            ip: ipAddress, 
            userId: user.$id, 
            userName: userName, 
            userEmail: user.email, 
          }
        );

        console.log('User IP and info saved successfully');

      } catch (error) {
        console.error('Error fetching or saving IP:', error);
      }
    };

    // saveUserIP();

  }, []);

  return null; 
};

export default SaveUserIP;
