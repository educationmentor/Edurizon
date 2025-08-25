const express = require('express');
const connectDB = require('./config/dbConnect');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const counselorRoutes = require('./routes/counselorRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const chatbotRoutes=require('./routes/chatbotRoutes')
const collegePredictorRoutes=require('./routes/collegePredictorRoutes')
const adminRoutes = require('./routes/adminRoutes');
const adminConsultationRoutes = require('./routes/adminConsultationRoutes');
const registeredStudentRoutes = require('./routes/registeredStudentRoutes')
const leadsRoutes = require('./routes/leadsRoutes')
const http = require('http');
const { Server } = require('socket.io');
const ChatMessage = require('./models/chatMessageModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');
dotenv.config();

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://192.168.1.2:3000','http://edurizon.in','http://www.edurizon.in','https://edurizon.in','https://www.edurizon.in','https://edurizon-git-noddy-updated-utkarshs-projects-467c395b.vercel.app','https://edurizon-five.vercel.app'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database Connection
connectDB();

// Cloudinary Setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_API_KEY
});


// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://192.168.1.2:3000','http://edurizon.in','http://www.edurizon.in','https://edurizon.in','https://www.edurizon.in','https://edurizon-git-noddy-updated-utkarshs-projects-467c395b.vercel.app','https://edurizon-five.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000, // 60 seconds (increase socket timeout)
});

// Track active users
const activeUsers = new Map();

// Socket middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication token is missing'));
  }
  
  try {
    // Skip detailed verification at socket level, just basic format check
    if (token.startsWith('Bearer ')) {
      next();
    } else {
      next(new Error('Invalid token format'));
    }
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication failed'));
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Store user info if provided
  if (socket.handshake.query.userId) {
    const userId = socket.handshake.query.userId;
    activeUsers.set(userId, socket.id);
    console.log(`User ${userId} is active with socket ${socket.id}`);
  }
  
  // Join a room based on consultation request ID
  socket.on('join_room', (requestId) => {
    if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
      socket.emit('error', { message: 'Invalid request ID' });
      return;
    }
    
    socket.join(requestId);
    console.log(`User joined room: ${requestId}`);
    
    // Notify client that join was successful
    socket.emit('joined_room', { requestId });
  });
  
  // Handle message sending
  socket.on('send_message', async (data) => {
    try {
      const { senderType, senderEmail, senderName, consultationRequest, message, clientMessageId } = data;
      
      if (!consultationRequest || !mongoose.Types.ObjectId.isValid(consultationRequest)) {
        socket.emit('message_error', { 
          clientMessageId,
          error: 'Invalid request ID format' 
        });
        return;
      }
      
      // Save message to database
      const newMessage = await ChatMessage.create({
        senderType,
        senderEmail,
        senderName,
        consultationRequest,
        message,
        clientMessageId,
        delivered: true
      });
      
      const messageData = {
        ...newMessage.toObject(),
        createdAt: new Date()
      };
      
      // Emit the message to the room (consultation request ID)
      io.to(consultationRequest).emit('receive_message', messageData);
      
      // Acknowledge message receipt back to sender
      socket.emit('message_delivered', { 
        clientMessageId,
        messageId: newMessage._id,
        timestamp: newMessage.createdAt
      });
      
    } catch (error) {
      console.error('Error handling message:', error);
      
      // Send error back to client for handling
      if (data && data.clientMessageId) {
        socket.emit('message_error', { 
          clientMessageId: data.clientMessageId,
          error: 'Failed to save message'
        });
      }
    }
  });
  
  // Handle marking messages as read
  socket.on('mark_read', async (data) => {
    try {
      const { consultationRequest, userType } = data;
      
      if (!consultationRequest || !mongoose.Types.ObjectId.isValid(consultationRequest)) {
        return;
      }
      
      const oppositeType = userType === 'counselor' ? 'student' : 'counselor';
      
      // Mark messages from the other user as read
      await ChatMessage.updateMany(
        { 
          consultationRequest,
          senderType: oppositeType,
          read: false
        },
        { read: true }
      );
      
      // Notify the room that messages have been read
      io.to(consultationRequest).emit('messages_read', { 
        consultationRequest, 
        userType 
      });
      
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });
  
  // Handle user going offline
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove user from active users
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        console.log(`User ${userId} is now offline`);
        break;
      }
    }
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/counselor', counselorRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chatbot',chatbotRoutes)
app.use('/api/collegePredictor',collegePredictorRoutes)
app.use('/api/admin', adminRoutes);
app.use('/api/admin/consultation', adminConsultationRoutes);
app.use('/api/registered-students', registeredStudentRoutes);
app.use('/api/leads', leadsRoutes);

// Use the HTTP server for listening
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});