require('dotenv').config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-default-secret-key-which-should-be-changed',
    adminSecret: process.env.JWT_ADMIN_SECRET || 'your-default-admin-secret-key-which-should-be-changed',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    username: process.env.EMAIL_USERNAME || 'edurizon.website@gmail.com',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'edurizon.website@gmail.com',
    secure: process.env.EMAIL_SECURE === 'true' || false,
    service: process.env.EMAIL_SERVICE || 'gmail'
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'da9cfxiph',
    api_key: process.env.CLOUDINARY_API_KEY || '128169163149369',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'lQrZJN7ziiJ6CwAeJMF9JUaScJw'
  }
  
}; 