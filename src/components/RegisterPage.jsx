import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../utils/appwrite';
import MoonLoader from 'react-spinners/MoonLoader';
import { useAuth } from '../utils/AuthContext';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();

  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password should be at least 8 characters long.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }
    
    // Validate inclusion of lowercase letters
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter.');
      return;
    }
    
    // Validate inclusion of numbers
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one digit.');
      return;
    }
    
    // Validate inclusion of special characters
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setError('Password must contain at least one special character.');
      return;
    }

    try {
      
      setLoading(true);
      const response = await account.create('unique()', email, password, name);
      console.log('Registration successful:', response);

      

      const session = await account.createEmailPasswordSession(email, password);
      console.log('Login successful:', session);

      
      
      setSuccessMessage('Registration successful! You are now logged in.');

      setTimeout(() => {
        setCurrentUser(session);
        console.log('Guest login successful');
        navigate('/chatroom');  
      }, 1000); 

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    }
    finally {
      setLoading(false);
      console.log('loading done');
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <MoonLoader color="#ffffff" size={60} />
        </div>
      )}

    <div className="min-h-screen flex items-center justify-center bg-[#111b21]">
      <div className="bg-[#202c33] p-8 rounded-2xl shadow-lg w-96 transform transition-transform duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#766ac8]">BuzzSphere</h2>
          <p className="text-[#6559b8] mt-2">Register to create an account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-1 ">
          {error && (
            <p className="text-red-500 text-sm text-center py-2 rounded-lg">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm text-center py-2 rounded-lg">
              {successMessage}
            </p>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#6559b8]">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 text-white bg-[#111b21] rounded-lg focus:ring-1 outline-none transition-colors duration-300"
              required
            />
          </div>

          <div className="space-y-1 pt-2">
            <label className="block text-sm font-medium text-[#6559b8]">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-white bg-[#111b21] rounded-lg focus:ring-1 outline-none transition-colors duration-300"
              required
            />
          </div>

          <div className="space-y-1 pt-2">
            <label className="block text-sm font-medium text-[#6559b8]">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-white bg-[#111b21] rounded-lg focus:ring-1 outline-none transition-colors duration-300"
              required
            />
          </div>

          <div className="space-y-1 pt-2">
            <label className="block text-sm font-medium text-[#6559b8]">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 text-white bg-[#111b21] rounded-lg focus:ring-1 outline-none transition-colors duration-300"
              required
            />
          </div>
          <div className='pt-3'>  
          <button
            type="submit"
            className="w-full py-2  font-semibold  px-4 bg-[#766ac8] text-white rounded-lg hover:bg-green-800 focus:ring-4 transition-colors duration-300 "
          >
            Register
          </button> </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm  text-gray-600">
            Already have an account?{' '}
            <button onClick={() => navigate('/')} className="text-green-600 hover:text-green-700 font-semibold">
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RegisterPage;
