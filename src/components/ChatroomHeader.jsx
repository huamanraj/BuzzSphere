import { useState, useEffect } from 'react';
import { databases, account, client } from '../utils/appwrite';
import { useNavigate } from 'react-router-dom';

const ChatroomHeader = () => {
  const [users, setUsers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();



  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await databases.listDocuments('67290b30003500e00f96', '67290cca001db048a31e');
  //       setUsers(response.documents);

  //       // Subscribe to changes
  //       const subscription = client.subscribe('collections.67290cca001db048a31e.documents', (response) => {
  //         setUsers((prevUsers) => {
  //           // Update users based on new data received
  //           const updatedUsers = response.payload.documents || [];
  //           return updatedUsers.length ? updatedUsers : prevUsers;
  //         });
  //       });

  //       return () => {
  //         subscription.unsubscribe();
  //       };
  //     } catch (error) {
  //       console.error('Error fetching users:', error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getOnlineUsersCount = () => {
    return users ? users.filter(user => user?.status === 'online').length : 0;
  };
  
  return (
    <header className="bg-[#202c33] shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-[#766ac8]">BuzzSphere</h2>
            {/* <div className="ml-3 px-2 py-1 bg-[#263842] rounded-full">
              <span className="text-sm text-red-700">
                {getOnlineUsersCount()} online
              </span>
            </div> */}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex -space-x-2">
              {Array.isArray(users) && users.slice(0, 5).map((user) => (
                <div
                  key={user.$id}
                  className="relative inline-block"
                  title={user?.name || '??'}
                >
                  <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center border-2 border-white">
                    <span className="text-sm font-medium text-rose-600">
                      {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${
                    user?.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                  } border-2 border-white`}></span>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="flex flex-wrap  gap-2 mb-3">
                
                {users.map((user) => (
                  <div
                    key={user.$id}
                    className="flex items-center px-3 py-2 rounded-full bg-slate-700"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-500 flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-slate-300">
                        {user?.name ? user.name.charAt(0).toUpperCase() : '??'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">{user?.name || 'Unknown'}</span>
                    <span className={`ml-2 w-2 h-2 rounded-full ${
                      user?.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ChatroomHeader;
