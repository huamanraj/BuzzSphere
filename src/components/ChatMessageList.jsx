import { useState, useEffect, useRef } from 'react';
import { databases, account, client } from '../utils/appwrite';


const ChatMessageList = () => {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await databases.listDocuments('67290b30003500e00f96', '67290cca001db048a31e');
        
        // Deduplicate messages when setting initial state
        const uniqueMessages = response.documents.filter(
          (message, index, self) =>
            index === self.findIndex((m) => m.$id === message.$id)
        );
        
        setMessages(uniqueMessages);

        // Real-time subscription
        const unsubscribe = client.subscribe([
          `databases.67290b30003500e00f96.collections.67290cca001db048a31e.documents`
        ], response => {
          if (response.events.includes('databases.*.collections.*.documents.*.create')) {
            setMessages(prevMessages => {
              const newMessages = [...prevMessages, response.payload];
              
              // Remove duplicates by `$id`
              return newMessages.filter(
                (message, index, self) => 
                  index === self.findIndex((m) => m.$id === message.$id)
              );
            });
          }

          if (response.events.includes('databases.*.collections.*.documents.*.update')) {
            setMessages(prevMessages => 
              prevMessages.map(message => 
                message.$id === response.payload.$id ? response.payload : message
              )
            );
          }

          if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
            setMessages(prevMessages => 
              prevMessages.filter(message => message.$id !== response.payload.$id)
            );
          }
        });

        return () => {
          unsubscribe();
        };

      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const getCurrentUser = async () => {
      try {
        const user = await account.get();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };

    fetchMessages();
    getCurrentUser();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-[#111b21]">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.userId === currentUser?.$id;
          const showSender = index === 0 || messages[index - 1].userId !== message.userId;

          return (
            <div
              key={message.$id}
              className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
            >
              {showSender && (
                <span className={`text-xs text-gray-500 mb-1 ${isCurrentUser ? 'mr-2' : 'ml-2'}`}>
                  {message.sender}
                </span>
              )}
              
              <div
                className={`flex items-end gap-2 ${
                  isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {showSender && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white bg-rose-400">
                    {message.sender.charAt(0).toUpperCase()}
                  </div>
                )}

                <div
                  className={`group relative max-w-[90%] px-4 py-2 rounded-xl ${
                    isCurrentUser
                      ? 'bg-[#766ac8] text-white rounded-tr-none'
                      : 'bg-[#202c33] text-white rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                  
                  <span
                    className={`absolute bottom-1 ${
                      isCurrentUser ? 'left-0 -translate-x-[calc(100%+0.5rem)]' : 'right-0 translate-x-[calc(100%+0.5rem)]'
                    } opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400`}
                  >
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessageList;