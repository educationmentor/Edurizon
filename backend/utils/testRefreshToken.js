const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

async function testRefreshToken() {
  try {
    console.log('Testing refresh token...');
    const { credentials } = await oauth2Client.refreshAccessToken();
    console.log('✅ Token refreshed successfully!');
    console.log('Access Token:', credentials.access_token);
  } catch (error) {
    console.error('❌ Failed to refresh token:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
  }
}

testRefreshToken();