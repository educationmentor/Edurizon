const mongoose = require('mongoose');

const partneredUniversitiesSchema = mongoose.Schema(
  {
    universityName: {
      type: String,
      required: true,
      index: true
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false
    },
    studentsServed: {
      type: Number,
      required: false
    },
  },
  {
    timestamps: true
  }
);

// Create compound index for efficient querying
partneredUniversitiesSchema.index({ universityName: 1, createdAt: -1 });

const PartneredUniversities = mongoose.model('PartneredUniversity', partneredUniversitiesSchema);

module.exports = PartneredUniversities; 