const { calendar, refreshGoogleToken } = require('./googleAuth');

/**
 * Generate a Google Meet link using Google Calendar API
 */
async function generateMeetLinkViaAPI(requestId, meetingTime, counselorEmail, studentEmail, studentName) {
  try {
    // Format meeting details
    const meetingDate = new Date(meetingTime || Date.now());
    const endTime = new Date(meetingDate.getTime() + 60 * 60 * 1000); // 1 hour meeting

    console.log(`[MEET API] Creating calendar event for meeting ${requestId}`);

    // Create event with conferencing data
    const event = {
      summary: 'Edurizon Consultation Meeting',
      description: `Consultation meeting between counselor (${counselorEmail}) and student (${studentName || studentEmail})`,
      start: {
        dateTime: meetingDate.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: [
        { email: counselorEmail },
        { email: studentEmail }
      ],
      conferenceData: {
        createRequest: {
          requestId: `edurizon-${requestId}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      }
    };

    // Insert event and get Meet link
    console.log(`[MEET API] Sending request to Google Calendar API`);
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendNotifications: true
    });

    if (response.data && response.data.hangoutLink) {
      const meetLink = response.data.hangoutLink;
      console.log(`[MEET API] Successfully created Meet link: ${meetLink}`);
      return meetLink;
    } else {
      throw new Error('No hangout link was returned from the API');
    }
  } catch (error) {
    console.error(`[MEET API ERROR] Failed to create Meet link: ${error.message}`);

    // Attempt to refresh the token and retry
    if (error.message.includes('invalid_grant')) {
      console.log('[MEET API] Attempting to refresh token and retry...');
      await refreshGoogleToken();
      return generateMeetLinkViaAPI(requestId, meetingTime, counselorEmail, studentEmail, studentName);
    }

    throw error;
  }
}

module.exports = {
  generateMeetLinkViaAPI
};