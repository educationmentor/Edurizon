const { google } = require('googleapis');
const crypto = require('crypto');

// Set up OAuth2 client with your credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials from environment variables
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  access_token: process.env.GOOGLE_ACCESS_TOKEN
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

/**
 * Generate a working Google Meet link that doesn't require Calendar API
 * This creates a link using the "new meeting" flow that works instantly
 * @param {string} requestId - Consultation request ID to create consistent link
 */
const generateFallbackMeetLink = (requestId) => {
  // Use requestId for consistent room naming instead of timestamp
  const roomName = `edurizon-${requestId || Date.now()}`;
  return `https://meet.google.com/new?hs=122&authuser=0&name=${encodeURIComponent(roomName)}`;
};

/**
 * Generate a Google Meet link via Calendar API
 * @param {string} studentName - Name of the student for the meeting
 * @param {string} meetingTime - ISO date string for the meeting time
 * @param {string} studentEmail - Email of the student (optional)
 * @param {string} counselorEmail - Email of the counselor (optional)
 * @param {string} requestId - Consultation request ID for fallback consistency
 * @returns {Promise<string>} - The Google Meet link
 */
const generateMeetLink = async (studentName, meetingTime, studentEmail, counselorEmail, requestId) => {
  try {
    const startTime = new Date(meetingTime || Date.now());
    const endTime = new Date(startTime.getTime() + 3600000); // 1 hour later
    
    const event = {
      summary: `Edurizon Consultation with ${studentName}`,
      description: 'Consultation session for education counseling',
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC',
      },
      conferenceData: {
        createRequest: {
          requestId: `edurizon-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      },
      // Enforce access control
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: false
    };
    
    // Configure attendees to make counselor the host
    event.attendees = [];
    
    if (studentEmail) {
      event.attendees.push({
        email: studentEmail,
        responseStatus: 'accepted',
        // Students are guests who need to knock
        optional: false
      });
    }
    
    if (counselorEmail) {
      event.attendees.push({
        email: counselorEmail,
        responseStatus: 'accepted',
        // Mark the counselor as the organizer/host
        organizer: true,
        self: true
      });
    }

    // Add conference data settings for entry control
    if (!event.conferenceData) {
      event.conferenceData = {};
    }
    
    // Set conference parameters to require joining approval
    event.conferenceData.conferenceDataVersion = 1;
    event.conferenceData.entryPoints = [{
      entryPointType: 'video',
      uri: '',
      label: 'meet.google.com',
      pin: ''
    }];
    
    // Configure explicit meeting access settings
    event.conferenceData.conferenceProperties = {
      allowedConferenceSolutionTypes: ['hangoutsMeet'],
      autoEntryMode: 'RESTRICTED' // This forces the "knock to join" behavior
    };

    // Log the request for debugging
    console.log('Creating Calendar event with Meet conferencing');
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all' // Send email notifications to attendees
    });

    console.log('Successfully created Meet with access control settings');
    return response.data.hangoutLink;
  } catch (error) {
    console.error('Failed to generate Meet link through API:', error.message);
    console.log('Using fallback meeting link');
    // Use requestId for consistent fallback link
    return generateFallbackMeetLink(requestId);
  }
};

module.exports = {
  generateMeetLink,
  calendar,
  generateFallbackMeetLink
};