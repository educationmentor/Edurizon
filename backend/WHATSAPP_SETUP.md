# WhatsApp Notification Setup for Meeting System

This document explains how to set up WhatsApp notifications for the Edurizon meeting scheduling system.

## Overview

The system can send WhatsApp notifications to meeting attendees using either:
1. **WhatsApp Business API** (Meta/Facebook)
2. **Twilio WhatsApp** (Alternative service)

## Option 1: WhatsApp Business API (Recommended)

### Prerequisites
- Facebook Developer Account
- WhatsApp Business Account
- Verified Business Phone Number

### Setup Steps

1. **Create Facebook App**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or use existing one
   - Add WhatsApp product to your app

2. **Configure WhatsApp Business API**
   - Get your Phone Number ID
   - Generate Access Token
   - Verify your business phone number

3. **Environment Variables**
   ```bash
   WHATSAPP_API_URL=https://graph.facebook.com/v18.0
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   WHATSAPP_ACCESS_TOKEN=your_access_token
   ```

## Option 2: Twilio WhatsApp

### Prerequisites
- Twilio Account
- WhatsApp Sandbox (for testing)
- Verified WhatsApp Business Number (for production)

### Setup Steps

1. **Create Twilio Account**
   - Sign up at [Twilio](https://www.twilio.com/)
   - Get Account SID and Auth Token

2. **Enable WhatsApp**
   - Go to Messaging > Try it out > Send a WhatsApp message
   - Follow setup instructions

3. **Environment Variables**
   ```bash
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_FROM=whatsapp:+1234567890
   ```

## Development Mode

If no WhatsApp credentials are configured, the system will:
- Log messages to console instead of sending
- Show "Development Mode" in logs
- Continue working for testing purposes

## Message Format

The system automatically generates formatted messages:

```
🎯 Meeting Invitation - Edurizon

Hello [Name]!

You have been invited to a meeting:

📋 [Meeting Title]
📅 Date: [Formatted Date]
⏰ Time: [Time]
⏱️ Duration: [Duration] minutes
📝 Agenda: [Agenda]

🔗 Join Meeting: [Zoom Link]
🔑 Password: [Password]

Please join the meeting 5 minutes before the scheduled time.

Best regards,
Edurizon Team
```

## Testing

1. **Test with Development Mode**
   - Check console logs for message format
   - Verify phone number validation

2. **Test with Real API**
   - Use sandbox numbers for testing
   - Verify message delivery

## Troubleshooting

### Common Issues

1. **Invalid Phone Number Format**
   - Ensure country code is included (+91 for India)
   - Remove spaces and special characters

2. **API Rate Limits**
   - WhatsApp Business API: 1000 messages/day
   - Twilio: Varies by plan

3. **Authentication Errors**
   - Verify API credentials
   - Check token expiration

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
DEBUG=whatsapp:*
```

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Implement rate limiting for production use
- Monitor API usage and costs

## Support

For technical support:
- Check console logs for error details
- Verify API credentials and permissions
- Test with development mode first
