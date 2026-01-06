const axios = require("axios");
const clientId =  process.env.ZOOM_CLIENT_ID;
const accountId = process.env.ZOOM_ACCOUNT_ID;
const clientSecret =  process.env.ZOOM_CLIENT_SECRET;
const auth_token_url = "https://zoom.us/oauth/token";
const api_base_url = "https://api.zoom.us/v2";
const dotenv = require("dotenv");
const btoa = require('btoa');
const Meeting = require("../models/meetingModel");

dotenv.config();

const createZoomMeeting = async (meetingData) => {
    try {
        const base_64 = btoa(clientId + ":" + clientSecret);
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${auth_token_url}?grant_type=account_credentials&account_id=${accountId}`,
          headers: {
            Authorization: "Basic " + `${base_64} `,
          },
        };

        let authResponse; 
        await axios
          .request(config)
          .then((response) => {
            authResponse = response.data;
          })
          .catch((error) => {
            console.log(error);
            throw new Error('Failed to authenticate with Zoom');
          });

        const access_token = authResponse.access_token;

        const headers = {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        };

        // Use the meeting data passed from the controller
        let data = JSON.stringify({
          topic: meetingData.topic || "Edurizon Meeting",
          type: 2, // Scheduled meeting
          start_time: meetingData.start_time,
          password: generateRandomPassword(),
          duration: meetingData.duration || 60,
          timezone: "Asia/Kolkata",
          agenda: meetingData.agenda || "",
          settings: meetingData.settings || {
            join_before_host: false,
            waiting_room: true,
            host_video: true,
            participant_video: true,
            mute_upon_entry: false,
            watermark: false,
            use_pmi: false,
            approval_type: 0,
            audio: 'both',
            auto_recording: 'none'
          },
        });

        const meetingResponse = await axios.post(
          `${api_base_url}/users/me/meetings`,
          data,
          { headers }
        );

        if (meetingResponse.status !== 201) {
          return {
            success: false,
            message: "Meeting Creation Failed"
          };
        }

        const response_data = meetingResponse.data;

        return {
          success: true,
          message: "Meeting created successfully",
          data: {
            id: response_data.id,
            join_url: response_data.join_url,
            start_url: response_data.start_url,
            start_time: response_data.start_time,
            topic: response_data.topic,
            duration: response_data.duration,
            password: response_data.password,
            status: 1,
          }
        };
    } catch (error) {
        console.error('Error creating Zoom meeting:', error);
        return {
          success: false,
          message: "Something went wrong",
          error: error.message
        };
    }
};

// Helper function to generate random password
const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Keep the old function for backward compatibility
const createMeeting = async (request, response) => {
  const { title, date, time, duration, agenda, attendees, organizer } = request.body;
  
  // Extract only IDs from attendees array
  const attendeeIds = attendees.map(attendee => 
    typeof attendee === 'string' ? attendee : attendee.id
  );
  
  const result = await createZoomMeeting({
        topic: title,
        start_time: `${date}T${time}:00`,
        duration: 60,
        agenda: agenda
    });
  const meeting = await Meeting.create({
    title,
    date,
    time,
    duration,
    agenda,
    attendees: attendeeIds,
    organizer,
    zoomMeetingId: result.data.id,
    zoomJoinUrl: result.data.join_url,
    zoomStartUrl: result.data.start_url,
    zoomPassword: result.data.password
  });
    if (result.success) {
        return response.status(200).send({
            success: true,
            message: "meeting created", 
            data: meeting,
            attendees: attendees,
        });
    } else {
        return response.status(500).send({
            message: result.message
        });
    }
};


const getMeeting = async (request, response) => {
  const { id } = request.params;

  try {
    // First, clean up old meetings (24+ hours old)
    await deleteOldMeetings();

    // Find meetings where the user is either an attendee or organizer
    const meetings = await Meeting.find({
      $or: [
        { attendees: { $in: [id] } },  // User is in attendees array
        { organizer: id }               // User is the organizer
      ]
    })
    .populate('attendees', 'firstName lastName email')
    .populate('organizer', 'firstName lastName email')
    .sort({ date: -1, time: -1 }); // Sort by meeting date and time, earliest first

    return response.status(200).send({
      success: true,
      message: "meetings fetched successfully",
      data: meetings
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return response.status(500).send({
      success: false,
      message: "Failed to fetch meetings",
      error: error.message
    });
  }
};

// Function to delete meetings that are 24+ hours old based on their scheduled date and time
const deleteOldMeetings = async () => {
  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    
    console.log(`Current time: ${now.toISOString()}`);
    console.log(`Looking for meetings scheduled before: ${twentyFourHoursAgo.toISOString()}`);
    
    // Find meetings that are 24+ hours old based on their scheduled date and time
    const oldMeetings = await Meeting.find({
      $expr: {
        $lt: [
          {
            $dateFromString: {
              dateString: { $concat: ["$date", "T", "$time", ":00"] },
              format: "%Y-%m-%dT%H:%M:%S"
            }
          },
          twentyFourHoursAgo
        ]
      }
    });

    console.log(`Found ${oldMeetings.length} meetings scheduled more than 24 hours ago`);

    if (oldMeetings.length > 0) {
      const deletedMeetings = await Meeting.deleteMany({
        $expr: {
          $lt: [
            {
              $dateFromString: {
                dateString: { $concat: ["$date", "T", "$time", ":00"] },
                format: "%Y-%m-%dT%H:%M:%S"
              }
            },
            twentyFourHoursAgo
          ]
        }
      });

      console.log(`Deleted ${deletedMeetings.deletedCount} old meetings based on scheduled date/time`);
      return deletedMeetings.deletedCount;
    }

    return 0;
  } catch (error) {
    console.error('Error deleting old meetings:', error);
    return 0;
  }
};

module.exports = { createMeeting, createZoomMeeting, getMeeting };