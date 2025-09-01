//createMeeting Controller
const axios = require("axios");
const clientId =  process.env.CLIENT_ID;
const accountId = process.env.ACCOUNT_ID;
const clientSecret =  process.env.CLIENT_SECRET;
const auth_token_url = "https://zoom.us/oauth/token";
const api_base_url = "https://api.zoom.us/v2";
const dotenv = require("dotenv");
const btoa = require('btoa');

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
            join_before_host: true,
            waiting_room: false,
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
    const result = await createZoomMeeting({
        topic: "Demo Application",
        start_time: "2024-09-22T10:00:00",
        duration: 60,
        agenda: "Demo meeting"
    });

    if (result.success) {
        return response.status(200).send({
            message: "meeting created", 
            data: result.data
        });
    } else {
        return response.status(500).send({
            message: result.message
        });
    }
};

module.exports = { createMeeting, createZoomMeeting };