import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ChatroomPage from './pages/ChatroomPage';
import ErrorPage from './pages/ErrorPage'; 
import { AuthProvider } from './utils/AuthContext.jsx'; // Import the AuthProvider
import ProtectedRoute from './utils/ProtectedRoute.jsx'; // Import the ProtectedRoute component
import RegisterPage from './components/RegisterPage.jsx';



const App = () => {
  return (
    <AuthProvider> 
      <Router>
        <Routes>
          
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/chatroom"
            element={<ProtectedRoute element={<ChatroomPage />} />} 
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;