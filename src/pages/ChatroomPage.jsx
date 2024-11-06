import ChatroomHeader from '../components/ChatroomHeader';
import ChatMessageList from '../components/ChatMessageList';
import ChatMessageInput from '../components/ChatMessageInput';
import SaveUserIP from '../components/SaveUserIP';
const ChatroomPage = () => {
  return (
    <div>
      <ChatroomHeader />
      <div className="flex flex-col h-screen pt-16 pb-20"> 
        <ChatMessageList />
      </div>
      <ChatMessageInput />
      
    </div>
  );
};

export default ChatroomPage;