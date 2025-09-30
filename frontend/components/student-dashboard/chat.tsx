import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { baseUrl } from '@/lib/baseUrl';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  _id?: string;
  clientMessageId?: string;
  senderType: 'student' | 'counselor';
  senderEmail: string;
  senderName: string;
  consultationRequest: string;
  message: string;
  createdAt: Date;
  read?: boolean;
  delivered?: boolean;
  pending?: boolean;
  error?: boolean;
}

interface ChatProps {
  userData: any;
  activeTab: string;
}

const Chat: React.FC<ChatProps> = ({ userData, activeTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const pendingMessagesRef = useRef<Set<string>>(new Set());
  const [consultationRequestId, setConsultationRequestId] = useState<string>('');

  // Get consultation request ID for the student
  useEffect(() => {
    const fetchConsultationRequest = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/consultation/student/${userData._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('studentToken') || sessionStorage.getItem('studentToken')}`
          }
        });
        
        if (response.data.success && response.data.data.length > 0) {
          // Use the first consultation request ID
          setConsultationRequestId(response.data.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching consultation request:', error);
      }
    };

    if (userData && userData._id) {
      fetchConsultationRequest();
    }
  }, [userData]);

  // Socket.IO connection
  useEffect(() => {
    if (userData && userData._id && consultationRequestId) {
      const token = localStorage.getItem('studentToken') || sessionStorage.getItem('studentToken');
      
      if (token) {
        // Ensure token has Bearer prefix
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        
        console.log('Student token for Socket.IO:', formattedToken);
        console.log('Student data:', userData);
        console.log('Consultation request ID:', consultationRequestId);
        
        const newSocket = io(baseUrl, {
          auth: {
            token: formattedToken
          },
          query: {
            userId: userData._id,
            userType: 'student'
          }
        });

        newSocket.on('connect', () => {
          console.log('Student connected to chat server');
          setConnected(true);
        });

        newSocket.on('disconnect', () => {
          console.log('Student disconnected from chat server');
          setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Student connection error:', error);
          console.error('Token being used:', formattedToken);
          toast.error(`Connection failed: ${error.message}`);
        });

        newSocket.on('receive_message', (messageData) => {
          console.log('Student received message:', messageData);
          setMessages(prevMessages => [...prevMessages, messageData]);
        });

        newSocket.on('message_delivered', (data) => {
          console.log('Student message delivered:', data);
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.clientMessageId === data.clientMessageId 
                ? { ...msg, pending: false, delivered: true, _id: data.messageId }
                : msg
            )
          );
          pendingMessagesRef.current.delete(data.clientMessageId);
        });

        newSocket.on('message_error', (data) => {
          console.error('Student message error:', data);
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.clientMessageId === data.clientMessageId 
                ? { ...msg, pending: false, error: true }
                : msg
            )
          );
          pendingMessagesRef.current.delete(data.clientMessageId);
        });

        setSocket(newSocket);
        socketRef.current = newSocket;

        return () => {
          newSocket.close();
        };
      }
    }
  }, [userData, consultationRequestId]);

  // Join room when consultation request is available
  useEffect(() => {
    if (consultationRequestId && socketRef.current) {
      socketRef.current.emit('join_room', consultationRequestId);
    }
  }, [consultationRequestId]);

  // Load chat history
  useEffect(() => {
    if (consultationRequestId) {
      const fetchChatHistory = async () => {
        try {
          const response = await axios.get(`${baseUrl}/api/chat/${consultationRequestId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('studentToken') || sessionStorage.getItem('studentToken')}`
            }
          });
          
          if (response.data.success) {
            setMessages(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };

      fetchChatHistory();
    }
  }, [consultationRequestId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !consultationRequestId) return;

    if (!socketRef.current) {
      toast.error('Not connected to chat server');
      return;
    }

    const clientMessageId = uuidv4();
    
    const newMsg: ChatMessage = {
      senderType: 'student',
      senderEmail: userData?.email || 'student@edurizon.com',
      senderName: userData?.name || 'Student',
      consultationRequest: consultationRequestId,
      message: newMessage.trim(),
      createdAt: new Date(),
      clientMessageId,
      pending: true
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    pendingMessagesRef.current.add(clientMessageId);

    socketRef.current.emit('send_message', {
      senderType: 'student',
      senderEmail: userData?.email || 'student@edurizon.com',
      senderName: userData?.name || 'Student',
      consultationRequest: consultationRequestId,
      message: newMessage.trim(),
      clientMessageId
    });

    // Mark messages as read
    socketRef.current.emit('mark_read', {
      consultationRequest: consultationRequestId,
      userType: 'student'
    });

    // Timeout for message delivery
    setTimeout(() => {
      if (pendingMessagesRef.current.has(clientMessageId)) {
        setMessages(prevMessages => prevMessages.map(msg => {
          if (msg.clientMessageId === clientMessageId) {
            return { ...msg, pending: false, error: true };
          }
          return msg;
        }));
        
        toast.error('Message may not have been delivered. Please try again.');
      }
    }, 5000);
  };

  if (activeTab !== 'chat') {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <Toaster />
      
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <PersonIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Your Counselor</h3>
            <p className="text-sm text-gray-500">
              {connected ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-500">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <PersonIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
              <p className="text-gray-500">Send a message to your counselor</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isOutgoing = message.senderType === 'student';
              const timestamp = message.createdAt 
                ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '00:00';
              
              return (
                <div
                  key={message._id || message.clientMessageId}
                  className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOutgoing
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    } ${message.pending ? 'opacity-70' : ''} ${message.error ? 'border-red-300 bg-red-50' : ''}`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <div className="flex items-center justify-end mt-1 gap-1">
                      <span className="text-xs opacity-70">{timestamp}</span>
                      {isOutgoing && (
                        <div className="flex items-center">
                          {message.error ? (
                            <span className="text-red-300 text-xs">!</span>
                          ) : message.pending ? (
                            <span className="text-blue-200 text-xs">...</span>
                          ) : message.read ? (
                            <DoneAllIcon className="w-3 h-3 text-blue-200" />
                          ) : (
                            <CheckIcon className="w-3 h-3 text-blue-200" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!connected}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !newMessage.trim() || !connected}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
