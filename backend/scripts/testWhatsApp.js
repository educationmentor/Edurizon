const { sendWhatsAppNotification, validatePhoneNumber, formatPhoneNumber } = require('../utils/whatsappApi');

// Test phone numbers (replace with real numbers for testing)
const testPhoneNumbers = [
  '+919876543210',  // India
  '+1234567890',    // US
  '919876543210',   // India without +
  '9876543210'      // India without country code
];

async function testWhatsAppFunctionality() {
  console.log('🧪 Testing WhatsApp API Functionality\n');

  // Test 1: Phone number validation
  console.log('1. Testing Phone Number Validation:');
  testPhoneNumbers.forEach(phone => {
    const isValid = validatePhoneNumber(phone);
    console.log(`   ${phone}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  });

  // Test 2: Phone number formatting
  console.log('\n2. Testing Phone Number Formatting:');
  testPhoneNumbers.forEach(phone => {
    const formatted = formatPhoneNumber(phone);
    console.log(`   ${phone} → ${formatted}`);
  });

  // Test 3: Send test message
  console.log('\n3. Testing Message Sending:');
  const testMessage = `🧪 Test Message - Edurizon

This is a test message to verify WhatsApp functionality.

Time: ${new Date().toLocaleString()}
Status: Testing in progress

Best regards,
Edurizon Team`;

  for (const phone of testPhoneNumbers) {
    if (validatePhoneNumber(phone)) {
      console.log(`\n   Sending test message to: ${phone}`);
      try {
        const result = await sendWhatsAppNotification(phone, testMessage);
        if (result.success) {
          console.log(`   ✅ Success: ${result.message}`);
        } else {
          console.log(`   ❌ Failed: ${result.message}`);
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    } else {
      console.log(`\n   Skipping invalid number: ${phone}`);
    }
  }

  console.log('\n🎯 Test completed!');
  console.log('\nNote: In development mode, messages are logged to console instead of being sent.');
  console.log('To send real messages, configure WhatsApp API credentials in your .env file.');
}

// Run the test
if (require.main === module) {
  testWhatsAppFunctionality().catch(console.error);
}

module.exports = { testWhatsAppFunctionality };
