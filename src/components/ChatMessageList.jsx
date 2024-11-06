import { useState, useEffect, useRef } from 'react';
import { databases, account, client } from '../utils/appwrite';
import { ID, Query } from 'appwrite';
import { AnimatePresence, motion } from 'framer-motion';
import Linkify from 'react-linkify';


const ChatMessageList = () => {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const initialLoadCount = 20;
  const chatContainerRef = useRef(null);

  const handleInitialScroll = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const fetchMessages = async (limit = initialLoadCount, offset = 0) => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_COLLECTION_ID,
          [
            Query.orderDesc('$createdAt'),
            Query.limit(limit),
            Query.offset(offset),
          ]
        );

        const uniqueMessages = response.documents
          .reverse() // Reverse for bottom-to-top loading
          .filter((message, index, self) =>
            index === self.findIndex((m) => m.$id === message.$id)
          );

        setMessages(uniqueMessages);
        handleInitialScroll(); // Scroll to bottom after loading
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

    // Real-time subscription for new messages
    const unsubscribe = client.subscribe(
      [`databases.${import.meta.env.VITE_APPWRITE_DATABASE_ID}.collections.${import.meta.env.VITE_APPWRITE_COLLECTION_ID}.documents`],
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages, response.payload];
            return newMessages.filter(
              (message, index, self) => index === self.findIndex((m) => m.$id === message.$id)
            );
          });
        }
        if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
          setMessages((prevMessages) =>
            prevMessages.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    handleInitialScroll();
  }, [messages]);


  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-[#111b21]">
      <div className="max-w-3xl mx-auto space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isCurrentUser = message.userId === currentUser?.$id;
            const showSender = index === 0 || messages[index - 1].userId !== message.userId;

            return (
              <motion.div
                key={message.$id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
              >
                {showSender && (
                  <span className={`text-xs text-gray-500 mb-1 ${isCurrentUser ? 'mr-2' : 'ml-2'}`}>
                    {message.sender}
                  </span>
                )}

                <div
                  className={`flex items-end gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {showSender && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white bg-rose-400">
                      {message.sender.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div
                    className={`group relative max-w-[90%] px-4 py-2 rounded-xl ${isCurrentUser
                        ? 'bg-[#766ac8] text-white rounded-tr-none'
                        : 'bg-[#202c33] text-white rounded-tl-none shadow-sm'
                      }`}

                  >
                    <p className="text-sm whitespace-pre-wrap ">



                      <Linkify
                        componentDecorator={(decoratedHref, decoratedText, key) => (
                          <a href={decoratedHref} target="_blank" rel="noopener noreferrer" key={key} className="">
                            {decoratedText}
                          </a>
                        )}
                      >
                        {message.text}
                      </Linkify>


                    </p>

                    <span
                      className={`absolute bottom-1 ${isCurrentUser
                          ? 'left-0 -translate-x-[calc(100%+0.5rem)]'
                          : 'right-0 translate-x-[calc(100%+0.5rem)]'
                        } opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400`}
                    >
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatMessageList;
