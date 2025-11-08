import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Search,
  Clock,
  User,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  CheckCheck,
  Check,
  Circle,
  MoreVertical,
  Phone,
  Video,
  Info
} from 'lucide-react';
import Loader from '../../components/Loader';

const ChatWithPatient = () => {
  const { backendUrl, dToken, profileData, getProfileData } = useContext(DoctorContext);
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load doctor profile if not available
  const ensureProfileData = async () => {
    if (!profileData && dToken) {
      console.log('🔄 Profile data missing, loading profile...');
      try {
        await getProfileData();
      } catch (error) {
        console.error('❌ Failed to load profile:', error);
        throw new Error('Failed to load doctor profile');
      }
    }
    return profileData;
  };

  // Load doctor's chat list
  const loadChatList = async () => {
    try {
      setError('');

      const doctorProfile = await ensureProfileData();

      if (!doctorProfile?._id) {
        throw new Error('Doctor profile not available');
      }

      const { data } = await axios.post(
        `${backendUrl}/api/chat/doctor/chat-list`,
        { docId: doctorProfile._id },
        { headers: { dtoken: dToken } }
      );

      if (data.success) {
        setChatList(data.chatList || []);

        if (data.chatList && data.chatList.length > 0) {
          const firstPatient = data.chatList[0];
          setSelectedPatient(firstPatient);
          await loadChatHistory(firstPatient.patientId);
        }
      } else {
        setError(data.message || 'Failed to load chat list');
        console.error('API Error:', data.message);
      }
    } catch (error) {
      console.error('❌ Error loading chat list:', error);
      setError(error.message || 'Failed to load conversations. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Load chat history with specific patient
  const loadChatHistory = async (patientId) => {
    try {

      if (!profileData?._id || !patientId) {
        console.error('Missing required data for loading chat history');
        return;
      }

      const { data: appointmentsData } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        { headers: { dtoken: dToken } }
      );

      if (appointmentsData.success) {
        const patientAppointments = appointmentsData.appointments.filter(
          apt => apt.userId === patientId
        );

        if (patientAppointments.length > 0) {
          const patientAppointment = patientAppointments[0];

          const { data: chatData } = await axios.post(
            `${backendUrl}/api/chat/doctor/chat-history`,
            {
              doctorId: profileData._id,
              patientId: patientId,
              appointmentId: patientAppointment._id
            },
            { headers: { dtoken: dToken } }
          );

          if (chatData.success) {
            const sortedMessages = (chatData.messages || []).sort((a, b) =>
              new Date(a.timestamp) - new Date(b.timestamp)
            );
            setMessages(sortedMessages);
          } else {
            console.warn('No chat history found:');
            setMessages([]);
          }
        } else {
          console.warn('No appointments found for patient:');
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('❌ Error loading chat history:', error);
      setMessages([]);
    }
  };

  const fetchPatientInfo = async (patientId) => {
    try {
      const { data: appointmentsData } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        { headers: { dtoken: dToken } }
      );
      if (appointmentsData.success) {
        const patientAppointment = appointmentsData.appointments.find(
          apt => apt.userId === patientId
        );

        if (patientAppointment && patientAppointment.userData) {
          return patientAppointment.userData;
        }
      }
    } catch (error) {
      console.error('Error fetching patient info:', error);
    }
    return null;
  };

  // Initialize socket connection
  const initializeSocket = () => {

    try {
      const socketConnection = io(backendUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000
      });

      setSocket(socketConnection);

      socketConnection.on('connect', () => {
        setConnectionStatus('connected');
      });

      socketConnection.on('disconnect', (reason) => {
        console.log('❌ Doctor Socket disconnected:', reason);
        setConnectionStatus('disconnected');
      });

      socketConnection.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        setConnectionStatus('error');
      });

      socketConnection.on('receive_message', (message) => {

        if (selectedPatient && message.patientId === selectedPatient.patientId) {
          setMessages(prev => {
            const exists = prev.some(msg => msg._id === message._id);
            const tempExists = prev.some(msg => msg.message === message.message && msg.senderType === message.senderType && msg._id.startsWith('temp-'));

            if (!exists) {
              if (message.senderType === 'doctor' && tempExists) {
                const filtered = prev.filter(msg => !(msg.message === message.message && msg.senderType === message.senderType && msg._id.startsWith('temp-')));
                return [...filtered, message];
              }
              return [...prev, message];
            }
            return prev;
          });
        }

        setChatList(prev => {
          const updatedList = prev.map(chat =>
            chat.patientId === message.patientId
              ? {
                ...chat,
                lastMessage: message.message,
                lastMessageTime: message.timestamp
              }
              : chat
          );

          const patientExists = prev.some(chat => chat.patientId === message.patientId);
          if (!patientExists && message.senderType === 'patient') {
            fetchPatientInfo(message.patientId).then(patientInfo => {
              if (patientInfo) {
                setChatList(currentList => [
                  {
                    patientId: message.patientId,
                    patientName: patientInfo.name,
                    patientImage: patientInfo.image,
                    lastMessage: message.message,
                    lastMessageTime: message.timestamp,
                    unreadCount: 1
                  },
                  ...currentList
                ]);
              }
            });
          }

          return updatedList.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
        });
      });

      return socketConnection;
    } catch (socketError) {
      console.error('❌ Failed to initialize socket:', socketError);
      setConnectionStatus('error');
      return null;
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !selectedPatient) {
      console.log('Cannot send message - missing requirements');
      return;
    }

    try {
      setSending(true);

      const { data: appointmentsData } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        { headers: { dtoken: dToken } }
      );

      if (appointmentsData.success) {
        const patientAppointments = appointmentsData.appointments.filter(
          apt => apt.userId === selectedPatient.patientId
        );

        if (patientAppointments.length > 0) {
          const patientAppointment = patientAppointments[0];

          const messageText = newMessage.trim();
          setNewMessage('');

          const messageData = {
            appointmentId: patientAppointment._id,
            doctorId: profileData._id,
            patientId: selectedPatient.patientId,
            senderType: 'doctor',
            message: messageText
          };

          socket.emit('send_message', messageData);

          socket.emit('join_chat', {
            doctorId: profileData._id,
            patientId: selectedPatient.patientId
          });

          const optimisticMessage = {
            _id: `temp-${Date.now()}`,
            ...messageData,
            timestamp: new Date(),
            read: false
          };

          setMessages(prev => [...prev, optimisticMessage]);

        } else {
          console.error('No appointment found for patient');
          setError('No appointment found for this patient.');
        }
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Handle patient selection
  const handlePatientSelect = async (patient) => {
    setSelectedPatient(patient);
    setMessages([]);
    await loadChatHistory(patient.patientId);

    if (socket && socket.connected) {
      socket.emit('join_chat', {
        doctorId: profileData._id,
        patientId: patient.patientId
      });
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '--:--';
    }
  };

  // Format date for last message
  const formatMessageDate = (timestamp) => {
    if (!timestamp) return 'No messages';

    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return 'Yesterday';
      if (diffDays > 1) return date.toLocaleDateString();
      return formatTime(timestamp);
    } catch {
      return 'Recently';
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (dateString === today) return 'Today';
    if (dateString === yesterday) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter chat list based on search
  const filteredChatList = chatList.filter(chat =>
    chat.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Safe image URL
  const getSafeImageUrl = (url) => {
    if (!url || url === 'data:image/png') {
      return 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239CA3AF\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z\' /%3E%3C/svg%3E';
    }
    return url;
  };

  // Retry loading
  const handleRetry = async () => {
    setLoading(true);
    setError('');
    setRetryCount(prev => prev + 1);
    await loadChatList();
  };

  useEffect(() => {

    if (dToken) {
      const initializeChat = async () => {
        try {
          await ensureProfileData();

          if (profileData?._id) {
            const socketConnection = initializeSocket();
            await loadChatList();

            const loadingTimeout = setTimeout(() => {
              if (loading) {
                console.warn('⚠️ Loading timeout - forcing stop');
                setLoading(false);
                setError('Loading took too long. Please refresh the page.');
              }
            }, 15000);

            return () => {
              clearTimeout(loadingTimeout);
              if (socketConnection) {
                socketConnection.disconnect();
              }
            };
          } else {
            setError('Doctor profile not available. Please complete your profile setup.');
            setLoading(false);
          }
        } catch (error) {
          console.error('❌ Initialization error:', error);
          setError(error.message || 'Failed to initialize chat');
          setLoading(false);
        }
      };

      initializeChat();
    } else {
      setError('Authentication required. Please log in again.');
      setLoading(false);
    }
  }, [dToken, profileData, retryCount]);

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Chat</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-lg shadow-blue-200 transition-all duration-200"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
            <button
              onClick={() => navigate('/doctor-profile')}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              Go to Profile
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader message="Loading your messages..." />
          <p className="text-sm text-gray-500 mt-4">
            {!profileData ? 'Loading doctor profile...' : 'Loading conversations...'}
          </p>
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex overflow-hidden">

      {/* Connection Status Indicator */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${connectionStatus === 'connected'
              ? 'bg-emerald-500/90 text-white'
              : connectionStatus === 'error'
                ? 'bg-rose-500/90 text-white'
                : 'bg-amber-500/90 text-white'
            }`}
        >
          <div className="flex items-center gap-2">
            <Circle
              className={`w-2 h-2 ${connectionStatus === 'connected' ? 'fill-white' : 'fill-white/70'} ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`}
            />
            {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'error' ? 'Connection Error' : 'Connecting...'}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Sidebar - Patients List - REDUCED WIDTH */}
      <div className="w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-xl">

        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-7 h-7" />
              Messages
            </h1>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm font-semibold">{chatList.length}</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500 shadow-lg"
            />
          </div>
        </div>

        {/* Patients List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredChatList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                <User size={40} className="text-blue-600" />
              </div>
              <p className="text-center font-semibold text-gray-900 mb-2 text-lg">No conversations yet</p>
              <p className="text-sm text-center text-gray-500 max-w-xs">
                When patients send you messages, they will appear here.
              </p>
            </div>
          ) : (
            <div className="p-2">
              {filteredChatList.map((patient, index) => (
                <motion.div
                  key={patient.patientId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handlePatientSelect(patient)}
                  className={`p-4 mb-2 rounded-2xl cursor-pointer transition-all duration-200 ${selectedPatient?.patientId === patient.patientId
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg scale-[1.02]'
                      : 'bg-white hover:bg-gray-50 hover:shadow-md'
                    }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={getSafeImageUrl(patient.patientImage)}
                        alt={patient.patientName}
                        className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md"
                      />
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold truncate text-base ${selectedPatient?.patientId === patient.patientId ? 'text-white' : 'text-gray-900'
                          }`}>
                          {patient.patientName || 'Unknown Patient'}
                        </h3>
                        <span className={`text-xs whitespace-nowrap ml-2 font-medium ${selectedPatient?.patientId === patient.patientId ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                          {formatMessageDate(patient.lastMessageTime)}
                        </span>
                      </div>

                      <p className={`text-sm truncate ${selectedPatient?.patientId === patient.patientId ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                        {patient.lastMessage || 'No messages yet'}
                      </p>
                    </div>

                    {patient.unreadCount > 0 && selectedPatient?.patientId !== patient.patientId && (
                      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                        {patient.unreadCount}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area - WIDER NOW */}
      <div className="flex-1 flex flex-col w-full md:w-[700px] lg:w-[900px] xl:w-[1100px] 2xl:w-[1300px] bg-white/50 backdrop-blur-sm transition-all duration-300">
        {selectedPatient ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200/50 p-5 bg-white/80 backdrop-blur-xl shadow-sm">
              <div className="flex items-center justify-between max-w-6xl mx-auto">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={getSafeImageUrl(selectedPatient.patientImage)}
                      alt={selectedPatient.patientName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">
                      {selectedPatient.patientName || 'Unknown Patient'}
                    </h2>
                    <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                      <Circle className="w-2 h-2 fill-emerald-500 animate-pulse" />
                      Active now
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-3 hover:bg-blue-50 rounded-xl transition-colors group">
                    <Phone className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                  </button>
                  <button className="p-3 hover:bg-blue-50 rounded-xl transition-colors group">
                    <Video className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                  </button>
                  <button className="p-3 hover:bg-blue-50 rounded-xl transition-colors group">
                    <Info className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Container - CENTERED & WIDER */}
            <div
              className="flex-1 overflow-y-auto custom-scrollbar flex justify-center"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            >
              <div className="w-full max-w-5xl px-6 py-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <Clock size={48} className="text-blue-600" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 mb-2">No messages yet</p>
                    <p className="text-sm text-gray-500 text-center max-w-sm">
                      Start the conversation by sending a message to your patient.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedMessages).map(([date, msgs]) => (
                      <div key={date}>
                        {/* Date Separator */}
                        <div className="flex items-center justify-center my-6">
                          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200/50">
                            <span className="text-xs font-semibold text-gray-600">
                              {formatDateHeader(date)}
                            </span>
                          </div>
                        </div>

                        {/* Messages for this date */}
                        <div className="space-y-4">
                          {msgs.map((message, index) => {
                            const isCurrentUserSender = message.senderType === 'doctor';
                            const isTempMessage = message._id && message._id.toString().startsWith('temp-');
                            const showAvatar = index === 0 || msgs[index - 1].senderType !== message.senderType;

                            return (
                              <motion.div
                                key={message._id || `temp-${message.timestamp}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex items-end gap-2 ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}
                              >
                                {/* Avatar */}
                                {!isCurrentUserSender && (
                                  <div className={`w-8 h-8 flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                                    <img
                                      src={getSafeImageUrl(selectedPatient.patientImage)}
                                      alt="Patient"
                                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                  </div>
                                )}

                                {/* Message Bubble */}
                                <div
                                  className={`max-w-lg px-5 py-3 rounded-2xl shadow-md ${isCurrentUserSender
                                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm'
                                      : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200/50'
                                    } ${isTempMessage ? 'opacity-70' : ''}`}
                                >
                                  <p className="text-sm leading-relaxed break-words">{message.message}</p>
                                  <div
                                    className={`flex items-center gap-1 mt-1 ${isCurrentUserSender ? 'justify-end' : 'justify-start'
                                      }`}
                                  >
                                    <span
                                      className={`text-xs ${isCurrentUserSender ? 'text-blue-100' : 'text-gray-500'
                                        }`}
                                    >
                                      {formatTime(message.timestamp)}
                                    </span>
                                    {isCurrentUserSender && (
                                      <span>
                                        {isTempMessage ? (
                                          <Clock className="w-3 h-3 text-blue-200" />
                                        ) : message.read ? (
                                          <CheckCheck className="w-4 h-4 text-blue-200" />
                                        ) : (
                                          <Check className="w-4 h-4 text-blue-200" />
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Spacer for doctor messages */}
                                {isCurrentUserSender && <div className="w-8 flex-shrink-0"></div>}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Message Input - CENTERED & WIDER */}
            <div className="border-t border-gray-200/50 p-5 bg-white/80 backdrop-blur-xl">
              <div className="flex gap-3 items-end max-w-5xl mx-auto">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white shadow-sm text-gray-900 placeholder-gray-400"
                    style={{ minHeight: '56px', maxHeight: '120px' }}
                    disabled={sending || connectionStatus !== 'connected'}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending || connectionStatus !== 'connected'}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none group"
                >
                  <Send size={22} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <MessageCircle size={64} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No chat selected</h3>
              <p className="text-gray-600 max-w-md mx-auto text-base">
                {chatList.length === 0
                  ? "When patients message you, their conversations will appear in the sidebar."
                  : "Select a patient from the list to start chatting."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ChatWithPatient;