import Layout from '@/components/admin/DocumentLayout';
import { useState, useEffect } from 'react';
import { baseUrl } from '@/lib/baseUrl';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import GridViewIcon from '@mui/icons-material/GridView';
import CallIcon from '@mui/icons-material/Call';
import MessageIcon from '@mui/icons-material/Message';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const navItems = [
  {
    href: "/admin/counsellor",
    icon: <GridViewIcon />,
    label: "Overview",
  },
  {
    href: "/admin/counsellor/calling-records",
    icon: <CallIcon />,
    label: "Session Records",
  },
  {
    href: "/admin/counsellor/view-sessions",
    icon: <ArrowForwardIosIcon />,
    label: "Create Session",
  },
  {
    href: "/admin/counsellor/messages",
    icon: <MessageIcon />,
    label: "Message",
  },
];

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'incoming' | 'outgoing';
}

interface Conversation {
  id: string;
  studentName: string;
  studentId: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  lastSeen: string;
}

const Messages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [adminData, setAdminData] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);

  useEffect(() => {
    if(sessionStorage.getItem('adminData')){
      const value = sessionStorage.getItem('adminData');
      const parsedValue = JSON.parse(value || '{}');
      setAdminData(parsedValue);
    }
    else{
      const value = localStorage.getItem('adminData');
      const parsedValue = JSON.parse(value || '{}');
      setAdminData(parsedValue);
    }
  }, []);

  // Fetch assigned students from backend
  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/registered-students/get-by-counsellor/${adminData._id}`);
        if (response.data.success) {
          setAssignedStudents(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching assigned students:', error);
        toast.error('Failed to fetch assigned students');
      }
    };

    if (adminData && adminData._id) {
      fetchAssignedStudents();
    }
  }, [adminData]);

  // Generate conversations from assigned students
  useEffect(() => {
    if (assignedStudents.length > 0) {
      const studentConversations: Conversation[] = assignedStudents.map((student, index) => ({
        id: student._id,
        studentName: student.name,
        studentId: student._id,
        lastMessage: 'No messages yet',
        timestamp: '00:00',
        unreadCount: 0,
        lastSeen: 'Never'
      }));

      // Add announcements channel
      const announcementsChannel: Conversation = {
        id: 'announcements',
        studentName: 'Announcements',
        studentId: 'announcements',
        lastMessage: 'Channel created',
        timestamp: '16:15',
        unreadCount: 0,
        lastSeen: '1 day ago'
      };

      setConversations([...studentConversations, announcementsChannel]);
    }
  }, [assignedStudents]);

  // Mock chat messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const mockChatMessages: ChatMessage[] = [
        {
          id: '1',
          sender: 'Student_1',
          message: 'I confirm to attend counseling session at 12, Jan',
          timestamp: '18:12',
          isRead: true,
          type: 'incoming'
        },
        {
          id: '2',
          sender: 'Counsellor',
          message: 'Done your counseling session will be scheduled accordingly',
          timestamp: '18:16',
          isRead: true,
          type: 'outgoing'
        }
      ];
      setChatMessages(mockChatMessages);
    }
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'Counsellor',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
        type: 'outgoing'
      };

      setChatMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      toast.success('Message sent successfully!');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  return (
    <Layout navItems={navItems} searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
      <Toaster />
      <div className="flex h-screen bg-gray-100">
        {/* Left Panel - Conversations List */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <PersonIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.studentName}
                      </h3>
                      <span className="text-sm text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <PersonIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedConv?.studentName}</h3>
                    <p className="text-sm text-gray-500">last seen {selectedConv?.lastSeen}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <PhoneIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <MoreVertIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {/* Date Separator */}
                <div className="flex items-center justify-center my-4">
                  <div className="bg-gray-200 h-px flex-1"></div>
                  <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">Today</span>
                  <div className="bg-gray-200 h-px flex-1"></div>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'outgoing'
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <div className="flex items-center justify-end mt-1 gap-1">
                          <span className="text-xs opacity-70">{message.timestamp}</span>
                          {message.type === 'outgoing' && (
                            <div className="flex items-center">
                              {message.isRead ? (
                                <DoneAllIcon className="w-3 h-3 text-blue-200" />
                              ) : (
                                <CheckIcon className="w-3 h-3 text-blue-200" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Message"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !newMessage.trim()}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SendIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a student to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
