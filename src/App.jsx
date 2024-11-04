import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ChatroomPage from './pages/ChatroomPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/chatroom" element={<ChatroomPage />} />
      </Routes>
    </Router>
  );
};

export default App;