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
    const { credentials } = await oauth2Client.refreshAccessToken();

  } catch (error) {
    console.error('❌ Failed to refresh token:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
  }
}

testRefreshToken();