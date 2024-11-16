import { useState, useEffect, useRef } from 'react';
import { databases, account, client } from '../utils/appwrite';
import { Query } from 'appwrite';
import { AnimatePresence, motion } from 'framer-motion';
import Linkify from 'react-linkify';

const ChatMessageList = ({ replyToMessage, setReplyToMessage }) => {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const initialLoadCount = 20;
  const chatContainerRef = useRef(null);
  const messageRefs = useRef({});
  const offsetRef = useRef(0);

  const handleInitialScroll = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

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

      const newMessages = response.documents.reverse();

      if (newMessages.length > 0) {
        setMessages((prevMessages) => {
          const uniqueMessages = [...prevMessages];
          newMessages.forEach(newMsg => {
            if (!uniqueMessages.some(msg => msg.$id === newMsg.$id)) {
              uniqueMessages.push(newMsg);
            }
          });
          return uniqueMessages;
        });
        offsetRef.current = offset + limit;
      }
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

  useEffect(() => {
    fetchMessages();
    getCurrentUser();

    const unsubscribe = client.subscribe(
      `databases.${import.meta.env.VITE_APPWRITE_DATABASE_ID}.collections.${import.meta.env.VITE_APPWRITE_COLLECTION_ID}.documents`,
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          const newMessage = response.payload;
          setMessages((prevMessages) => {
            if (!prevMessages.some(msg => msg.$id === newMessage.$id)) {
              return [...prevMessages, newMessage];
            }
            return prevMessages;
          });
          handleInitialScroll();
        }

        if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
          setMessages((prevMessages) =>
            prevMessages.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    handleInitialScroll();
  }, [messages]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      if (scrollTop === 0 && !loading) {
        setLoading(true);
        fetchMessages(initialLoadCount, offsetRef.current).finally(() => setLoading(false));
      }
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading]);

  const handleReply = (event, message) => {
    event.preventDefault();
    event.stopPropagation();
    setReplyToMessage(message);
  };

  const scrollToMessage = (messageId) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (replyToMessage?.$id) {
      scrollToMessage(replyToMessage.$id);
    }
  }, [replyToMessage]);

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
            const repliedMessage = messages.find((m) => m.$id === message.replyTo);

            return (
              <motion.div
                key={message.$id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.1 }}
                className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
                data-id={message.$id}
                ref={(el) => (messageRefs.current[message.$id] = el)}
                onDoubleClick={(event) => handleReply(event, message)}
              >
                {showSender && (
                  <span className={`text-xs text-gray-500 mb-1 ${isCurrentUser ? 'mr-2' : 'ml-2'}`}>
                    {message.sender}
                  </span>
                )}

                {repliedMessage && (
                  <div
                    className="mb-1 pl-2 pr-1 py-1 text-[12px] text-gray-400 bg-transparent border-l-2 border-gray-500/50 rounded-sm cursor-pointer"
                    onClick={() => setReplyToMessage(repliedMessage)}
                  >
                    <span className="block font-semibold text-gray-300">{repliedMessage.sender}:</span>
                    <span className="line-clamp-1">
                      {repliedMessage.text.split(" ").slice(0, 5).join(" ")}{repliedMessage.text.split(" ").length > 5 && "…"}
                    </span>
                  </div>
                )}

                <div className={`group relative max-w-[90%] px-4 py-2 rounded-xl ${isCurrentUser ? 'bg-[#766ac8] text-white rounded-tr-none' : 'bg-[#202c33] text-white rounded-tl-none shadow-sm'}`}>


                  <p className="text-sm whitespace-pre-wrap">
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
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatMessageList;