const { google } = require('googleapis');
require('dotenv').config();

// Create OAuth2 client with credentials from environment variables
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials with refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

// Create calendar instance
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Helper function to refresh token when needed
const refreshGoogleToken = async () => {
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    return credentials.access_token;
  } catch (error) {
    console.error('[GOOGLE AUTH] Failed to refresh token:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    throw new Error('Failed to refresh Google token');
  }
};

module.exports = {
  oauth2Client,
  calendar,
  refreshGoogleToken
};