// filepath: c:\Users\VICTUS\OneDrive\Desktop\Edurizon\backend\utils\testGoogleCredentials.js
const { google } = require('googleapis');
require('dotenv').config(); // Load environment variables

console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID || '❌ Missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET || '❌ Missing');
console.log('GOOGLE_REFRESH_TOKEN:', process.env.GOOGLE_REFRESH_TOKEN || '❌ Missing');
console.log('GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI || '❌ Missing');
// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

// Test the credentials by making a simple API call
async function testCredentials() {
  try {
    // Try to get a new access token using the refresh token
    console.log('Attempting to refresh access token...');
    const { credentials } = await oauth2Client.refreshAccessToken();
    console.log('✅ SUCCESS! Token refreshed successfully');
    console.log('Access token:', credentials.access_token.substring(0, 10) + '...');
    
    // Create calendar instance
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Try to list calendars
    console.log('Attempting to list calendars...');
    const response = await calendar.calendarList.list();
    console.log('✅ SUCCESS! Found', response.data.items.length, 'calendars');
    console.log('Primary calendar ID:', response.data.items.find(cal => cal.primary)?.id);
    
    return true;
  } catch (error) {
    console.error('❌ ERROR testing credentials:', error.message);
    if (error.message.includes('invalid_grant')) {
      console.error('Your refresh token is expired or invalid. You need to generate a new refresh token.');
    }
    return false;
  }
}

// Run the test
testCredentials()
  .then(success => {
    if (success) {
      console.log('✅ Your Google API credentials are working correctly!');
    } else {
      console.log('❌ Your Google API credentials have issues that need to be resolved.');
    }
  });