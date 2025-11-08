import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Clock, RefreshCw, AlertCircle, Database } from 'lucide-react';
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
  const [showDebug, setShowDebug] = useState(false);
  const [debugData, setDebugData] = useState(null);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const appointmentRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if appointment is expired
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

  // DATABASE DEBUG FUNCTION - Check what's actually in the database
  const debugDatabase = async () => {
    try {
      console.log('🔬 Running database debug...');

      const requestData = {
        appointmentId: String(appointmentData._id),
        doctorId: String(appointmentData.docId),
        patientId: String(userData._id)
      };

      console.log('🔬 Debug request data:', requestData);

      const { data } = await axios.post(
        `${backendUrl}/api/chat/debug-messages`,
        requestData,
        { headers: { token } }
      );

      console.log('🔬 DATABASE DEBUG RESULTS:', data);
      setDebugData(data);

      if (data.success && data.analysis) {
        console.log('📊 Analysis:');
        data.analysis.forEach((msg, idx) => {
          console.log(`\n${idx + 1}. ${msg.senderType.toUpperCase()}:`, msg.message);
          console.log('   Appointment ID Match:', msg.appointmentIdMatch ? '✅' : '❌',
            `(Expected: ${requestData.appointmentId}, Got: ${msg.appointmentId})`);
          console.log('   Doctor ID Match:', msg.doctorIdMatch ? '✅' : '❌',
            `(Expected: ${requestData.doctorId}, Got: ${msg.doctorId})`);
          console.log('   Patient ID Match:', msg.patientIdMatch ? '✅' : '❌',
            `(Expected: ${requestData.patientId}, Got: ${msg.patientId})`);
          console.log('   All Match:', msg.allMatch ? '✅ YES' : '❌ NO');
        });
      }

      alert(`Database check complete!\n\nTotal messages: ${data.totalInDB}\nRelated to this chat: ${data.relatedMessages}\n\nCheck console for details!`);
    } catch (error) {
      console.error('❌ Debug error:', error);
      alert('Debug failed. Check console for errors.');
    }
  };

  // Load chat history
  const loadChatHistory = async (doctorId, patientId, appointmentId) => {
    try {
      console.log('🔄 Loading chat history...');
      console.log('📋 Request params:', {
        doctorId,
        patientId,
        appointmentId,
        types: {
          doctorId: typeof doctorId,
          patientId: typeof patientId,
          appointmentId: typeof appointmentId
        }
      });

      const requestPayload = {
        doctorId: String(doctorId),
        patientId: String(patientId),
        appointmentId: String(appointmentId)
      };

      console.log('📤 Sending request to API:', requestPayload);

      const { data } = await axios.post(
        `${backendUrl}/api/chat/patient/chat-history`,
        requestPayload,
        {
          headers: { token },
          timeout: 15000
        }
      );

      console.log('📥 Full API Response:', JSON.stringify(data, null, 2));

      if (data.success) {
        const receivedMessages = data.messages || [];

        console.log('📊 Messages received from API:', {
          total: receivedMessages.length,
          doctor: receivedMessages.filter(m => m.senderType === 'doctor').length,
          patient: receivedMessages.filter(m => m.senderType === 'patient').length
        });

        // Log first 3 messages for inspection
        console.log('📝 First 3 messages from API:');
        receivedMessages.slice(0, 3).forEach((msg, idx) => {
          console.log(`  ${idx + 1}.`, {
            id: msg._id,
            sender: msg.senderType,
            text: msg.message.substring(0, 40) + '...',
            appointmentId: msg.appointmentId,
            doctorId: msg.doctorId,
            patientId: msg.patientId,
            timestamp: msg.timestamp
          });
        });

        // Sort by timestamp
        const sortedMessages = receivedMessages.sort((a, b) =>
          new Date(a.timestamp) - new Date(b.timestamp)
        );

        console.log('✅ Setting messages state with', sortedMessages.length, 'messages');
        setMessages(sortedMessages);
        return sortedMessages;
      } else {
        console.error('❌ API returned success=false:', data.message);
        setError(data.message || 'Failed to load messages');
        setMessages([]);
        return [];
      }
    } catch (error) {
      console.error('❌ Error loading chat history:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

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

  // Reload messages manually
  const reloadMessages = async () => {
    if (appointmentRef.current && userData) {
      console.log('🔄 Manual reload triggered');
      setLoading(true);
      await loadChatHistory(
        appointmentRef.current.docId,
        userData._id,
        appointmentRef.current._id
      );
      setLoading(false);
    }
  };

  // Initialize socket connection
  const initializeSocket = (appointment) => {
    console.log('🔌 Initializing socket connection...');

    // Disconnect existing socket if any
    if (socketRef.current) {
      console.log('🔌 Disconnecting existing socket');
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

    // Socket connected
    socketConnection.on('connect', () => {
      console.log('✅ Socket connected with ID:', socketConnection.id);
      setConnectionStatus('connected');

      const roomData = {
        doctorId: String(appointment.docId),
        patientId: String(userData._id),
        appointmentId: String(appointment._id)
      };

      console.log('🚪 Joining chat room with data:', roomData);
      socketConnection.emit('join_chat', roomData);
    });

    // Socket disconnected
    socketConnection.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected. Reason:', reason);
      setConnectionStatus('disconnected');
    });

    // Connection error
    socketConnection.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setConnectionStatus('error');
    });

    // Reconnected
    socketConnection.on('reconnect', (attemptNumber) => {
      console.log('✅ Socket reconnected after', attemptNumber, 'attempts');
      setConnectionStatus('connected');

      // Rejoin room
      socketConnection.emit('join_chat', {
        doctorId: String(appointment.docId),
        patientId: String(userData._id),
        appointmentId: String(appointment._id)
      });

      // Reload messages
      loadChatHistory(appointment.docId, userData._id, appointment._id);
    });

    // Receive new message
    socketConnection.on('receive_message', (message) => {
      console.log('📨 New message received via socket:', {
        id: message._id,
        sender: message.senderType,
        text: message.message.substring(0, 30) + '...',
        appointmentId: message.appointmentId,
        doctorId: message.doctorId,
        patientId: message.patientId
      });

      setMessages(prev => {
        // Check for duplicates
        const exists = prev.some(m => m._id === message._id);

        if (exists) {
          console.log('⚠️ Duplicate message ignored:', message._id);
          return prev;
        }

        console.log('✅ Adding new message to state');
        const updated = [...prev, message];

        // Sort by timestamp
        const sorted = updated.sort((a, b) =>
          new Date(a.timestamp) - new Date(b.timestamp)
        );

        console.log('📊 Updated message count:', {
          total: sorted.length,
          doctor: sorted.filter(m => m.senderType === 'doctor').length,
          patient: sorted.filter(m => m.senderType === 'patient').length
        });

        return sorted;
      });
    });

    // Message sent confirmation
    socketConnection.on('message_sent', (data) => {
      console.log('✅ Message sent confirmation:', data);
      setSending(false);
    });

    // Message error
    socketConnection.on('message_error', (error) => {
      console.error('❌ Message error from socket:', error);
      setError('Failed to send message');
      setSending(false);
    });

    return socketConnection;
  };

  // Fetch appointment data and initialize chat
  const fetchAppointmentData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔍 Fetching appointment with ID:', appointmentId);

      // Get user's appointments
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token }
      });

      console.log('📋 Appointments API response:', data);

      if (data.success) {
        const appointment = data.appointments.find(apt => apt._id === appointmentId);

        if (!appointment) {
          console.error('❌ Appointment not found in list');
          setError('Appointment not found');
          setLoading(false);
          return;
        }

        console.log('✅ Appointment found:', {
          id: appointment._id,
          docId: appointment.docId,
          userId: appointment.userId,
          slotDate: appointment.slotDate,
          slotTime: appointment.slotTime
        });

        // Check eligibility
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

        // Store appointment data
        setAppointmentData(appointment);
        appointmentRef.current = appointment;
        setDoctorInfo(appointment.docData);

        // IMPORTANT: Load chat history FIRST
        console.log('📜 Loading chat history before socket...');
        await loadChatHistory(appointment.docId, userData._id, appointment._id);

        // THEN initialize socket
        console.log('🔌 Now initializing socket...');
        initializeSocket(appointment);

      } else {
        setError(data.message || 'Failed to load appointments');
      }
    } catch (error) {
      console.error('❌ Error fetching appointment:', error);
      setError('Failed to load chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !appointmentRef.current || sending) {
      console.log('⚠️ Cannot send message:', {
        hasMessage: !!newMessage.trim(),
        hasSocket: !!socket,
        hasAppointment: !!appointmentRef.current,
        isSending: sending
      });
      return;
    }

    try {
      setSending(true);
      setError('');

      const messageText = newMessage.trim();
      const tempId = `temp-${Date.now()}-${Math.random()}`;

      console.log('📤 Sending message:', messageText);

      // Clear input immediately
      setNewMessage('');

      // Prepare message data
      const messageData = {
        appointmentId: String(appointmentRef.current._id),
        doctorId: String(appointmentRef.current.docId),
        patientId: String(userData._id),
        senderType: 'patient',
        message: messageText,
        timestamp: new Date().toISOString()
      };

      console.log('📤 Message data being sent:', {
        appointmentId: messageData.appointmentId,
        doctorId: messageData.doctorId,
        patientId: messageData.patientId,
        senderType: messageData.senderType
      });

      // Optimistically add to UI
      const tempMessage = { ...messageData, _id: tempId };
      setMessages(prev => [...prev, tempMessage]);

      // Send via socket
      socket.emit('send_message', messageData);

      // Auto-remove temp message after 10 seconds if not replaced
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m._id !== tempId));
        setSending(false);
      }, 10000);

    } catch (error) {
      console.error('❌ Error sending message:', error);
      setError('Failed to send message');
      setSending(false);
      // Restore message to input
      setNewMessage(newMessage);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Initialize on mount
  // Initialize on mount
  useEffect(() => {
    if (token && userData && appointmentId) {
      fetchAppointmentData();
    } else {
      // Don't log error on initial mount - userData loads async from context
      if (token && appointmentId && !userData) {
        console.log('⏳ Waiting for user data to load...');
      }
    }

    // Cleanup on unmount
    return () => {
      console.log('🧹 Component unmounting, cleaning up socket...');
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('connect_error');
        socketRef.current.off('reconnect');
        socketRef.current.off('receive_message');
        socketRef.current.off('message_sent');
        socketRef.current.off('message_error');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token, userData, appointmentId]);

  // Loading state
  if (loading) {
    return <Loader message="Loading chat..." />;
  }

  // Error state - no appointment found
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
      {/* Connection Status Indicator */}
      <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-full text-xs font-medium shadow-lg ${connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
          connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
        }`}>
        {connectionStatus === 'connected' ? '🟢 Connected' :
          connectionStatus === 'error' ? '🔴 Connection Error' :
            '🟡 Connecting...'}
      </div>

      {/* Debug Toggle Button */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-xs font-medium shadow-lg transition-colors flex items-center gap-2"
      >
        <Database size={16} />
        {showDebug ? 'Hide Debug' : 'Show Debug'}
      </button>

      {/* Debug Panel */}
      {showDebug && (
        <div className="fixed top-16 left-4 z-50 bg-black bg-opacity-95 text-white text-xs p-4 rounded-lg shadow-2xl max-w-md max-h-[80vh] overflow-auto">
          <div className="font-bold text-lg mb-3 text-yellow-400">🔍 Debug Panel</div>

          {/* Database Check Button */}
          <button
            onClick={debugDatabase}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg mb-4 font-bold text-sm transition-colors"
          >
            🔬 Check Database
          </button>

          {/* Current State */}
          <div className="space-y-2 mb-4 pb-4 border-b border-gray-600">
            <div className="font-semibold text-blue-300">Current State:</div>
            <div>📊 Total Messages: <span className="font-bold text-green-400">{messages.length}</span></div>
            <div>👨‍⚕️ Doctor Messages: <span className="font-bold text-green-400">{messages.filter(m => m.senderType === 'doctor').length}</span></div>
            <div>👤 Patient Messages: <span className="font-bold text-green-400">{messages.filter(m => m.senderType === 'patient').length}</span></div>
          </div>

          {/* IDs Being Used */}
          <div className="space-y-2 mb-4 pb-4 border-b border-gray-600">
            <div className="font-semibold text-blue-300">IDs in Query:</div>
            <div className="bg-gray-800 p-2 rounded text-xs break-all">
              <div className="mb-1"><span className="text-purple-400">Appointment:</span> {appointmentData._id}</div>
              <div className="mb-1"><span className="text-purple-400">Doctor:</span> {appointmentData.docId}</div>
              <div><span className="text-purple-400">Patient:</span> {userData._id}</div>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="space-y-2">
            <div className="font-semibold text-blue-300">Recent Messages:</div>
            {messages.length === 0 ? (
              <div className="text-gray-400 italic">No messages yet</div>
            ) : (
              messages.slice(-5).map((m, i) => (
                <div key={i} className="bg-gray-800 p-2 rounded mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{m.senderType === 'doctor' ? '👨‍⚕️' : '👤'}</span>
                    <span className="font-semibold text-yellow-400">{m.senderType}</span>
                  </div>
                  <div className="text-gray-300 mb-1">{m.message.substring(0, 40)}...</div>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <div>ID: {m._id}</div>
                    <div className="flex items-center gap-1">
                      <span>AppointmentID Match:</span>
                      {m.appointmentId === appointmentData._id ?
                        <span className="text-green-400">✅</span> :
                        <span className="text-red-400">❌ ({m.appointmentId})</span>
                      }
                    </div>
                    <div className="flex items-center gap-1">
                      <span>DoctorID Match:</span>
                      {m.doctorId === appointmentData.docId ?
                        <span className="text-green-400">✅</span> :
                        <span className="text-red-400">❌ ({m.doctorId})</span>
                      }
                    </div>
                    <div className="flex items-center gap-1">
                      <span>PatientID Match:</span>
                      {m.patientId === userData._id ?
                        <span className="text-green-400">✅</span> :
                        <span className="text-red-400">❌ ({m.patientId})</span>
                      }
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Debug Data from Database */}
          {debugData && (
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="font-semibold text-blue-300 mb-2">Database Results:</div>
              <div className="bg-gray-800 p-2 rounded text-xs">
                <div>Total in DB: {debugData.totalInDB}</div>
                <div>Related: {debugData.relatedMessages}</div>
                <div>Matching All IDs: {debugData.analysis?.filter(a => a.allMatch).length || 0}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => navigate('/my-appointments')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Back to appointments"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Doctor Image */}
            <img
              src={doctorInfo.image}
              alt={doctorInfo.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />

            {/* Doctor Info */}
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">
                Dr. {doctorInfo.name}
              </h1>
              <p className="text-sm text-gray-500">{doctorInfo.speciality}</p>
            </div>

            {/* Appointment Info */}
            <div className="text-right">
              <p className="text-xs text-gray-500">Appointment</p>
              <p className="text-sm font-medium text-gray-900">
                {appointmentData.slotDate.split('_').join('/')}
              </p>
              <p className="text-xs text-gray-600">{appointmentData.slotTime}</p>
            </div>
          </div>

          {/* Reload Button */}
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

      {/* Error Display */}
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

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-[calc(100vh-280px)] flex flex-col">

          {/* Messages Area */}
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
                      {/* Avatar */}
                      <div className={`text-2xl flex-shrink-0 ${isPatient ? 'order-1' : ''}`}>
                        {isPatient ? '👤' : '👨‍⚕️'}
                      </div>

                      {/* Message Bubble */}
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

          {/* Message Input Area */}
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

            {/* Status Messages */}
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

        {/* Info Box */}
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