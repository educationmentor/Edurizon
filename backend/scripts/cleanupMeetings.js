const mongoose = require('mongoose');
const Meeting = require('../models/meetingModel');
const config = require('../config/config');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for cleanup script');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to delete meetings that are 24+ hours old based on their scheduled date and time
const deleteOldMeetings = async () => {
  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    
    console.log(`Starting cleanup at ${now.toISOString()}`);
    console.log(`Looking for meetings scheduled before ${twentyFourHoursAgo.toISOString()}`);
    
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

      console.log(`Successfully deleted ${deletedMeetings.deletedCount} old meetings based on scheduled date/time`);
      return deletedMeetings.deletedCount;
    }

    console.log('No old meetings found to delete');
    return 0;
  } catch (error) {
    console.error('Error deleting old meetings:', error);
    return 0;
  }
};

// Main execution
const runCleanup = async () => {
  try {
    await connectDB();
    const deletedCount = await deleteOldMeetings();
    console.log(`Cleanup completed. Deleted ${deletedCount} meetings.`);
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
};

// Run the cleanup
runCleanup();
