const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// WhatsApp Business API configuration
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Alternative: Twilio WhatsApp (if you prefer)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;

/**
 * Send WhatsApp notification using WhatsApp Business API
 * @param {string} phoneNumber - Recipient's phone number (with country code)
 * @param {string} message - Message to send
 * @returns {Promise<Object>} - Response object
 */
const sendWhatsAppNotification = async (phoneNumber, message) => {
  try {
    // Clean phone number (remove + and spaces, ensure it starts with country code)
    const cleanPhoneNumber = phoneNumber.replace(/[\s\+]/g, '');
    
    // If using WhatsApp Business API
    if (WHATSAPP_API_URL && WHATSAPP_PHONE_NUMBER_ID && WHATSAPP_ACCESS_TOKEN) {
      return await sendViaWhatsAppBusinessAPI(cleanPhoneNumber, message);
    }
    
    // If using Twilio
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_WHATSAPP_FROM) {
      return await sendViaTwilio(cleanPhoneNumber, message);
    }
    
    // Fallback: Log the message (for development/testing)
    console.log('📱 WhatsApp Message (Development Mode):');
    console.log(`To: ${phoneNumber}`);
    console.log(`Message: ${message}`);
    console.log('Note: Set up WhatsApp API credentials to send actual messages');
    
    return {
      success: true,
      message: 'Message logged (development mode)',
      phoneNumber: phoneNumber
    };
    
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return {
      success: false,
      message: 'Failed to send WhatsApp notification',
      error: error.message
    };
  }
};

/**
 * Send via WhatsApp Business API
 */
const sendViaWhatsAppBusinessAPI = async (phoneNumber, message) => {
  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      message: 'WhatsApp message sent successfully',
      messageId: response.data.messages?.[0]?.id,
      phoneNumber: phoneNumber
    };
  } catch (error) {
    console.error('WhatsApp Business API Error:', error.response?.data || error.message);
    throw new Error(`WhatsApp API Error: ${error.response?.data?.error?.message || error.message}`);
  }
};

/**
 * Send via Twilio WhatsApp
 */
const sendViaTwilio = async (phoneNumber, message) => {
  try {
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        From: TWILIO_WHATSAPP_FROM,
        To: `whatsapp:${phoneNumber}`,
        Body: message
      },
      {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return {
      success: true,
      message: 'WhatsApp message sent successfully via Twilio',
      messageId: response.data.sid,
      phoneNumber: phoneNumber
    };
  } catch (error) {
    console.error('Twilio WhatsApp Error:', error.response?.data || error.message);
    throw new Error(`Twilio Error: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Send bulk WhatsApp notifications
 * @param {Array} recipients - Array of phone numbers
 * @param {string} message - Message to send
 * @returns {Promise<Array>} - Array of results
 */
const sendBulkWhatsAppNotifications = async (recipients, message) => {
  try {
    const results = [];
    
    // Send messages with a small delay to avoid rate limiting
    for (let i = 0; i < recipients.length; i++) {
      const result = await sendWhatsAppNotification(recipients[i], message);
      results.push(result);
      
      // Add delay between messages (100ms)
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error sending bulk WhatsApp notifications:', error);
    return {
      success: false,
      message: 'Failed to send bulk notifications',
      error: error.message
    };
  }
};

/**
 * Validate phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
const validatePhoneNumber = (phoneNumber) => {
  // Basic validation: should be 10-15 digits, optionally starting with +
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Format phone number for WhatsApp
 * @param {string} phoneNumber - Raw phone number
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d\+]/g, '');
  
  // If no country code, assume India (+91)
  if (!cleaned.startsWith('+')) {
    cleaned = '+91' + cleaned;
  }
  
  // Remove + for WhatsApp API
  return cleaned.replace('+', '');
};

module.exports = {
  sendWhatsAppNotification,
  sendBulkWhatsAppNotifications,
  validatePhoneNumber,
  formatPhoneNumber
};
