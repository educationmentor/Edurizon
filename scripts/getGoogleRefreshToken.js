const { google } = require('googleapis');
const readline = require('readline');
const http = require('http');
const url = require('url');
const open = require('open');
require('dotenv').config();

// Create a local server to receive the OAuth2 callback
const getOAuthCode = () => {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const urlParts = url.parse(req.url, true);
        const code = urlParts.query.code;
        
        if (code) {
          // Close response
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('Authentication successful! You can close this window.');
          
          // Resolve the promise with the code
          server.close();
          resolve(code);
        }
      } catch (error) {
        reject(error);
      }
    });

    server.listen(3000, () => {
      console.log('Temporary server is running on http://localhost:3000');
    });
  });
};

async function getRefreshToken() {
  console.log('\nDebug Information:');
  console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? '✓ Present' : '✗ Missing');
  console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '✓ Present' : '✗ Missing');

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000'
  );

  // Generate the url that will be used for authorization
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ],
    prompt: 'consent'
  });

  console.log('\nOpening browser for authentication...');
  await open(authUrl);

  try {
    console.log('Waiting for authentication...');
    const code = await getOAuthCode();
    console.log('Authentication code received!');

    console.log('\nExchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      console.error('\nNo refresh token received. Please:');
      console.error('1. Go to https://myaccount.google.com/permissions');
      console.error('2. Remove access for your application');
      console.error('3. Run this script again');
      process.exit(1);
    }

    console.log('\nSuccess! Token Information:');
    console.log('Access Token:', tokens.access_token ? '✓ Received' : '✗ Missing');
    console.log('Refresh Token:', tokens.refresh_token ? '✓ Received' : '✗ Missing');
    console.log('Expiry:', tokens.expiry_date ? new Date(tokens.expiry_date).toLocaleString() : 'Not specified');

    // Verify the token works
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    console.log('\nVerifying token with Google Calendar API...');
    await calendar.calendarList.list();
    console.log('✓ Token verification successful!');

    console.log('\nAdd this to your .env file:');
    console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);

  } catch (error) {
    console.error('\nError:', error.message);
    if (error.message.includes('unauthorized_client')) {
      console.error('\nTroubleshooting Steps:');
      console.error('1. Verify you created a Desktop application OAuth client');
      console.error('2. Verify you are using the correct Client ID and Secret');
      console.error('3. Make sure you added your email as a test user');
      console.error('4. Try creating a new OAuth client ID');
    }
  }
}

// First install required package
console.log('Installing required package...');
require('child_process').execSync('npm install open --save-dev', { stdio: 'inherit' });

// Run the main function
getRefreshToken();