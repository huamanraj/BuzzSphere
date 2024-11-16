import ChatroomHeader from '../components/ChatroomHeader';
import ChatMessageList from '../components/ChatMessageList';
import ChatMessageInput from '../components/ChatMessageInput';
import SaveUserIP from '../components/SaveUserIP';
import { useState } from 'react';
const ChatroomPage = () => {
  
  const [replyToMessage, setReplyToMessage] = useState(null);

  return (
    <div>
      <ChatroomHeader />
      <div className="flex flex-col h-screen pt-16 pb-20">
      <ChatMessageList replyToMessage={replyToMessage} setReplyToMessage={setReplyToMessage} />
      </div>
      <ChatMessageInput replyToMessage={replyToMessage} setReplyToMessage={setReplyToMessage} />

    </div>
  );
};

export default ChatroomPage;