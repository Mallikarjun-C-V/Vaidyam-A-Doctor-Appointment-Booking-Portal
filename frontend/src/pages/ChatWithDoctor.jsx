import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader';

const ChatWithDoctor = () => {
  const { appointmentId } = useParams();
  const { backendUrl, token, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const appointmentRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isAppointmentExpired = (item) => {
    try {
      const [day, month, year] = item.slotDate.split('_');
      const appointmentStart = new Date(`${month} ${day}, ${year} ${item.slotTime}`);
      const appointmentEnd = new Date(appointmentStart.getTime() + 30 * 60000);
      const now = new Date();
      return now > appointmentEnd;
    } catch (err) {
      console.error("Error parsing appointment date:", err);
      return false;
    }
  };

  const loadChatHistory = async (doctorId, patientId, appointmentId) => {
    try {
      const requestPayload = {
        doctorId: String(doctorId),
        patientId: String(patientId),
        appointmentId: String(appointmentId)
      };

      const { data } = await axios.post(
        `${backendUrl}/api/chat/patient/chat-history`,
        requestPayload,
        {
          headers: { token },
          timeout: 15000
        }
      );

      if (data.success) {
        const receivedMessages = data.messages || [];
        const sortedMessages = receivedMessages.sort((a, b) =>
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMessages(sortedMessages);
        return sortedMessages;
      } else {
        setError(data.message || 'Failed to load messages');
        setMessages([]);
        return [];
      }
    } catch (error) {
      if (error.response) {
        setError(`Server error: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        setError('No response from server');
      } else {
        setError('Failed to load chat history');
      }
      return [];
    }
  };

  const reloadMessages = async () => {
    if (appointmentRef.current && userData) {
      setLoading(true);
      await loadChatHistory(
        appointmentRef.current.docId,
        userData._id,
        appointmentRef.current._id
      );
      setLoading(false);
    }
  };

  const initializeSocket = (appointment) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socketConnection = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    socketRef.current = socketConnection;
    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      setConnectionStatus('connected');
      socketConnection.emit('join_chat', {
        doctorId: String(appointment.docId),
        patientId: String(userData._id),
        appointmentId: String(appointment._id)
      });
    });

    socketConnection.on('disconnect', () => setConnectionStatus('disconnected'));
    socketConnection.on('connect_error', () => setConnectionStatus('error'));

    socketConnection.on('reconnect', () => {
      setConnectionStatus('connected');
      socketConnection.emit('join_chat', {
        doctorId: String(appointment.docId),
        patientId: String(userData._id),
        appointmentId: String(appointment._id)
      });
      loadChatHistory(appointment.docId, userData._id, appointment._id);
    });

    socketConnection.on('receive_message', (message) => {
      setMessages(prev => {
        const exists = prev.some(m => m._id === message._id);
        if (exists) return prev;
        const updated = [...prev, message];
        return updated.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      });
    });

    socketConnection.on('message_sent', () => setSending(false));
    socketConnection.on('message_error', () => {
      setError('Failed to send message');
      setSending(false);
    });

    return socketConnection;
  };

  const fetchAppointmentData = async () => {
    try {
      setLoading(true);
      setError('');

      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token }
      });

      if (data.success) {
        const appointment = data.appointments.find(apt => apt._id === appointmentId);

        if (!appointment) {
          setError('Appointment not found');
          setLoading(false);
          return;
        }

        if (appointment.cancelled) {
          setError('This appointment was cancelled');
          setLoading(false);
          return;
        }

        if (isAppointmentExpired(appointment)) {
          setError('This appointment has expired');
          setLoading(false);
          return;
        }

        setAppointmentData(appointment);
        appointmentRef.current = appointment;
        setDoctorInfo(appointment.docData);

        await loadChatHistory(appointment.docId, userData._id, appointment._id);
        initializeSocket(appointment);
      } else {
        setError(data.message || 'Failed to load appointments');
      }
    } catch {
      setError('Failed to load chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !appointmentRef.current || sending) return;

    try {
      setSending(true);
      setError('');

      const messageText = newMessage.trim();
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      setNewMessage('');

      const messageData = {
        appointmentId: String(appointmentRef.current._id),
        doctorId: String(appointmentRef.current.docId),
        patientId: String(userData._id),
        senderType: 'patient',
        message: messageText,
        timestamp: new Date().toISOString()
      };

      const tempMessage = { ...messageData, _id: tempId };
      setMessages(prev => [...prev, tempMessage]);
      socket.emit('send_message', messageData);

      setTimeout(() => {
        setMessages(prev => prev.filter(m => m._id !== tempId));
        setSending(false);
      }, 10000);

    } catch {
      setError('Failed to send message');
      setSending(false);
      setNewMessage(newMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (token && userData && appointmentId) {
      fetchAppointmentData();
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token, userData, appointmentId]);

  if (loading) {
    return <Loader message="Loading chat..." />;
  }

  if (!doctorInfo || !appointmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chat Not Available</h2>
          <p className="text-gray-600 mb-6">{error || 'Chat not found'}</p>
          <button
            onClick={() => navigate('/my-appointments')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="inline mr-2" size={18} />
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-full text-xs font-medium shadow-lg ${connectionStatus === 'connected'
          ? 'bg-green-100 text-green-800'
          : connectionStatus === 'error'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
        {connectionStatus === 'connected'
          ? '🟢 Connected'
          : connectionStatus === 'error'
            ? '🔴 Connection Error'
            : '🟡 Connecting...'}
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/my-appointments')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Back to appointments"
            >
              <ArrowLeft size={20} />
            </button>

            <img
              src={doctorInfo.image}
              alt={doctorInfo.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />

            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">
                Dr. {doctorInfo.name}
              </h1>
              <p className="text-sm text-gray-500">{doctorInfo.speciality}</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500">Appointment</p>
              <p className="text-sm font-medium text-gray-900">
                {appointmentData.slotDate.split('_').join('/')}
              </p>
              <p className="text-xs text-gray-600">{appointmentData.slotTime}</p>
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <button
              onClick={reloadMessages}
              disabled={loading}
              className="flex items-center gap-2 text-xs bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Reloading...' : 'Reload Messages'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-[calc(100vh-280px)] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Clock size={56} className="mb-4 opacity-30" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm text-gray-400">Start a conversation with your doctor</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isTemp = message._id?.startsWith('temp-');
                const isPatient = message.senderType === 'patient';

                return (
                  <motion.div
                    key={message._id || `msg-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[70%] ${isPatient ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`text-2xl flex-shrink-0 ${isPatient ? 'order-1' : ''}`}>
                        {isPatient ? '👤' : '👨‍⚕️'}
                      </div>

                      <div
                        className={`px-4 py-2 rounded-2xl ${isPatient
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-900 rounded-bl-none'
                          } ${isTemp ? 'opacity-60' : ''}`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.message}
                        </p>
                        <p className={`text-xs mt-1 ${isPatient ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                          {isTemp && ' ⏳'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex gap-3 items-end">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={sending || connectionStatus !== 'connected'}
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sending || connectionStatus !== 'connected'}
                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-lg"
                title="Send message"
              >
                {sending ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>

            {connectionStatus !== 'connected' && (
              <p className="text-xs text-red-500 mt-2 text-center font-medium">
                ⚠️ Cannot send messages - {connectionStatus === 'error' ? 'connection error' : 'connecting...'}
              </p>
            )}
            {sending && (
              <p className="text-xs text-blue-600 mt-2 text-center">
                Sending message...
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 text-center">
            💡 This chat is private and secure. Your doctor will respond during their working hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWithDoctor;
