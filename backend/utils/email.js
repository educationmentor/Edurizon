const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Gmail-specific configuration
  if (config.email.service === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.username,
        pass: config.email.password
      },
      secure: false, // Gmail uses STARTTLS
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Generic SMTP configuration
  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure, // true for 465, false for other ports
    auth: {
      user: config.email.username,
      pass: config.email.password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Verify transporter connection
const verifyConnection = async (transporter) => {
  try {
    await transporter.verify();
    console.log('✅ Email server connection verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error.message);
    return false;
  }
};

// Send email function
const sendEmail = async (options) => {
  try {
    // Validate required options
    if (!options.email || !options.subject || (!options.message && !options.html)) {
      throw new Error('Missing required email options: email, subject, and message/html are required');
    }

    // Create transporter
    const transporter = createTransporter();

    // Verify connection
    const isConnected = await verifyConnection(transporter);
    if (!isConnected) {
      throw new Error('Email server connection failed');
    }

    // Define email options
    const mailOptions = {
      from: {
        name: 'Edurizon',
        address: config.email.from
      },
      to: options.email,
      subject: options.subject,
      text: options.message || options.html?.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
      html: options.html || options.message
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('📧 Email sent successfully:', {
      messageId: info.messageId,
      to: options.email,
      subject: options.subject
    });

    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    };

  } catch (error) {
    console.error('❌ Error sending email:', {
      error: error.message,
      to: options.email,
      subject: options.subject
    });

    // Return error object instead of throwing
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email'
    };
  }
};

// Test email function for development
const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    const isConnected = await verifyConnection(transporter);
    
    if (isConnected) {
      console.log('🎯 Email configuration is working correctly');
      return true;
    } else {
      console.log('⚠️ Email configuration has issues');
      return false;
    }
  } catch (error) {
    console.error('❌ Email configuration test failed:', error.message);
    return false;
  }
};

// Send test email
const sendTestEmail = async (testEmail) => {
  try {
    const result = await sendEmail({
      email: testEmail,
      subject: '🧪 Edurizon Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">🧪 Email Test Successful!</h1>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <p>This is a test email to verify that your Edurizon email configuration is working correctly.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Server:</strong> ${config.email.host}:${config.email.port}</p>
          </div>
        </div>
      `
    });

    if (result.success) {
      console.log('✅ Test email sent successfully');
      return result;
    } else {
      console.log('❌ Test email failed:', result.error);
      return result;
    }
  } catch (error) {
    console.error('❌ Test email error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendEmail,
  testEmailConnection,
  sendTestEmail
}; 