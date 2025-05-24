require('dotenv').config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-default-secret-key-which-should-be-changed',
    adminSecret: process.env.JWT_ADMIN_SECRET || 'your-default-admin-secret-key-which-should-be-changed',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@edurizon.com'
  }
}; 