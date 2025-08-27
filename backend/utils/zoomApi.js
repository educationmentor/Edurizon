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

  const createMeeting = async (request, response) => {
    const base_64 = btoa(clientId + ":" + clientSecret);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${auth_token_url}?grant_type=account_credentials&account_id=${accountId}`,
      headers: {
        Authorization: "Basic " + `${base_64} `,
      },
    };
    try {  
      let authResponse; 
      await axios
        .request(config)
        .then((response) => {
          authResponse = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
  
      const access_token = authResponse.access_token;

      const headers = {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      };
  
      let data = JSON.stringify({
        topic: "Demo Application",
        type: 2,
        start_time: "2024-09-22",
        password: "12334",
        duration: 60,
        timezone: "Asia/Kolkata",
        settings: {
          join_before_host: true,
          waiting_room: false,
        },
      });
  
      const meetingResponse = await axios.post(
        `${api_base_url}/users/me/meetings`,
        data,
        { headers }
      );
  
      if (meetingResponse.status !== 201) {
        return response.send({message: "Meeting Creation Failed"})
      }
  
      const response_data = meetingResponse.data;
  
      const content = {
        meeting_url: response_data.join_url,
        meetingTime: response_data.start_time,
        purpose: response_data.topic,
        duration: response_data.duration,
        message: "Success",
        password: response_data.password,
        status: 1,
      };
      return response.status(200).send({message: "meeting created", data: content})
    } catch (error) {
        return response.status(500).send({message: "Something went wrong"})
    }
};

module.exports = { createMeeting };