import { useState, useEffect } from 'react';
import { databases, account } from '../utils/appwrite';
import EmojiPicker from 'emoji-picker-react';

const ChatMessageInput = () => {
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await account.get();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };

    getCurrentUser();
  }, []);

  const handleSendMessage = async () => {
    try {
      if (message.trim()) {
        await databases.createDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_COLLECTION_ID,
          'unique()',
          {
            text: message,
            sender: currentUser.name,
            userId: currentUser.$id,
            createdAt: new Date().toISOString(),
          }
        );
        setMessage('');
        setShowEmojiPicker(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#202c33]  p-4">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-end space-x-2">
          {/* Message Input */}
          <div className="flex-grow relative bg-[#2a3942] rounded-lg shadow-sm border border-[#3d5360] focus-within:border-[#557080] focus-within:ring-1 focus-within:ring-[#3d5360]">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write a message..."
              className="block w-full resize-none px-4 py-3 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none min-h-[50px] max-h-[150px] rounded-lg"
              style={{ scrollbarWidth: 'none' }}
              rows={1}
            />
            
            {/* Emoji Picker Button */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute bottom-2 right-2 p-2 text-gray-400 hover:text-[#8696a0] transition-colors duration-200"
              type="button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            className="inline-flex items-center px-8 p-4 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-[#8774e1] hover:bg-[#6051aa] focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            
          </button>
        </div>

        {/* Emoji Picker Popover */}
        {showEmojiPicker && (
          <div className="absolute bottom-full right-0 mb-2">
            <div className=" rounded-lg shadow-lg ">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                skinTone={1}
                height={300}
                width={350}
                theme="dark"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageInput;