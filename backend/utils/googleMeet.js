const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const generateMeetLink = async (studentName) => {
  try {
    const event = {
      summary: `Edurizon Consultation with ${studentName}`,
      description: 'Consultation session for education counseling',
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        timeZone: 'UTC',
      },
      conferenceData: {
        createRequest: {
          requestId: `edurizon-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1
    });

    return response.data.hangoutLink;
  } catch (error) {
    console.error('Failed to generate Meet link:', error);
    return null;
  }
};

module.exports = {
  generateMeetLink
}; 