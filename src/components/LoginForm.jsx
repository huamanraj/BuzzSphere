import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../utils/appwrite';
import { useAuth } from '../utils/AuthContext';
import MoonLoader from 'react-spinners/MoonLoader';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { currentUser, setCurrentUser } = useAuth();

  

  useEffect(() => {
    setLoading(true);
    if ( currentUser) {
      navigate('/chatroom');
    }
    setLoading(false);
    
  }, [ currentUser, navigate]);

  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const session = await account.createEmailPasswordSession(email, password);
      setCurrentUser(session);
        console.log('Guest login successful');
        navigate('/chatroom');  
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      console.log('loading done');
    }
  };



  const handleGuestLogin = async () => {
    setError(null);
    setLoading(true);
  
    try {
      // Get the user's IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();
  
      // Extract the last 4 digits of the IP address
      const ipParts = ip.split('.');
      const ipSuffix = ipParts[ipParts.length - 1];
  
      // Create an anonymous session
      const user = await account.createAnonymousSession();
  
      // Generate a guest name using the IP suffix
      const guestName = `Guest User ${ipSuffix}`;
  
      // Update the anonymous user's name
      await account.updateName(guestName);
  
      setCurrentUser({ ...user, name: guestName });
      console.log(`Guest login successful as ${guestName}`);
      navigate('/chatroom');  
    } catch (error) {
      console.error('Guest login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      console.log('Loading done');
    }
  };
  
  

    // const handleGuestLogin = async () => {
    //   const guestEmail = 'guest@gmail.com';
    //   const guestPassword = '12345678';

    //   setError(null);
    //   setEmail(guestEmail);
    //   setPassword(guestPassword);
    //   setLoading(true);

    //   try {
    //     const user = await account.createEmailPasswordSession(guestEmail, guestPassword);
    //     setCurrentUser(user);
    //     console.log('Guest login successful');
    //     navigate('/chatroom');  
       
    //   } catch (error) {
    //     console.error('Guest login error:', error);
    //     setError(error.message);
    //   } finally {
    //     setLoading(false);
    //     console.log('loading done');
    //   }
    // };



  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <MoonLoader color="#ffffff" size={60} />
        </div>
      )}


      <div className="min-h-screen flex items-center justify-center bg-[#111b21]">
        <div className="bg-[#202c33] p-8 rounded-2xl shadow-lg w-96 transform  transition-transform duration-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#766ac8]">BuzzSphere</h2>
            <p className="text-[#6559b8] mt-2">Login to acess chatroom</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <p className="text-red-500 text-sm text-center  py-2 rounded-lg">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#6559b8]">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2   text-white bg-[#111b21] rounded-lg focus:ring-1  outline-none transition-colors duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#6559b8]">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2  text-white bg-[#111b21] rounded-lg focus:ring-1  outline-none transition-colors duration-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-semibold px-4 bg-[#766ac8] text-white rounded-lg hover:bg-green-900 focus:ring-4 transition-colors duration-300 "
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <div className="text-sm  text-gray-600">
              Don't have an account?{' '}<button onClick={() => navigate('/register')} className="text-blue-600 hover:text-blue-700 hover:font-semibold p-1 font-medium">
                  Register here
                </button>

              <div className="flex flex-col">


                
                <button onClick={handleGuestLogin} className="text-white hover:text-white font-medium">
                  Login as Guest
                </button>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default LoginForm;
