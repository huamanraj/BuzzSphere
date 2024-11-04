import ChatroomHeader from '../components/ChatroomHeader';
import ChatMessageList from '../components/ChatMessageList';
import ChatMessageInput from '../components/ChatMessageInput';

const ChatroomPage = () => {
  return (
    <div>
      <ChatroomHeader />
      <div className="flex flex-col h-screen pt-16 pb-20"> {/* pt-16 for header, pb-24 for input */}
        <ChatMessageList />
      </div>
      <ChatMessageInput />
    </div>
  );
};

export default ChatroomPage;