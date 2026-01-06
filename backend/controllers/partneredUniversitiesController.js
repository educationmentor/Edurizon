const PartneredUniversities = require('../models/partneredUniversitiesModel');

// @desc    Fetch all partnered universities
// @route   GET /api/partnered-universities
// @access  Public
const getAllUniversities = async (req, res) => {
  try {
    const universities = await PartneredUniversities.find({})
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: universities.length,
      data: universities
    });
  } catch (error) {
    console.error('Error fetching partnered universities:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching partnered universities',
      error: error.message
    });
  }
};

// @desc    Get single university by ID
// @route   GET /api/partnered-universities/:id
// @access  Public
const getUniversityById = async (req, res) => {
  try {
    const university = await PartneredUniversities.findById(req.params.id);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'Partnered university not found'
      });
    }

    res.status(200).json({
      success: true,
      data: university
    });
  } catch (error) {
    console.error('Error fetching partnered university:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching partnered university',
      error: error.message
    });
  }
};

// @desc    Get universities by country
// @route   GET /api/partnered-universities/country/:country
// @access  Public
const getUniversitiesByCountry = async (req, res) => {
  try {
    const universities = await PartneredUniversities.find({
      country: { $regex: req.params.country, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: universities.length,
      data: universities
    });
  } catch (error) {
    console.error('Error fetching universities by country:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching universities by country',
      error: error.message
    });
  }
};

// @desc    Add a new partnered university
// @route   POST /api/partnered-universities
// @access  Private (Admin only)
const addUniversity = async (req, res) => {
  try {
    const {
      universityName,
      country,
      city,
      studentsServed
    } = req.body;

    // Validate required fields
    if (!universityName || !universityName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'University name is required and cannot be empty'
      });
    }

    // Validate studentsServed is a positive number
    const studentsCount = parseInt(studentsServed);
    if (isNaN(studentsCount) || studentsCount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Students served must be a valid positive number'
      });
    }

    if (studentsCount > 1000000) {
      return res.status(400).json({
        success: false,
        message: 'Students served number is unreasonably large (maximum 1,000,000)'
      });
    }

    // Validate university name length
    if (universityName.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: 'University name is too long (maximum 200 characters)'
      });
    }

    // Validate country and city length
    if (country && country.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Country name is too long (maximum 100 characters)'
      });
    }

    if (city && city.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'City name is too long (maximum 100 characters)'
      });
    }

    const newUniversity = new PartneredUniversities({
      universityName: universityName.trim(),
      country: country ? country.trim() : '',
      city: city ? city.trim() : '',
      studentsServed: studentsCount
    });

    const savedUniversity = await newUniversity.save();

    res.status(201).json({
      success: true,
      message: 'Partnered university added successfully',
      data: savedUniversity
    });
  } catch (error) {
    console.error('Error adding partnered university:', error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while adding partnered university',
      error: error.message
    });
  }
};

// @desc    Update a partnered university
// @route   PUT /api/partnered-universities/:id
// @access  Private (Admin only)
const updateUniversity = async (req, res) => {
  try {
    const {
      universityName,
      country,
      city,
      studentsServed
    } = req.body;

    const university = await PartneredUniversities.findById(req.params.id);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'Partnered university not found'
      });
    }

    // Validate university name if provided
    if (universityName !== undefined && (!universityName || !universityName.trim())) {
      return res.status(400).json({
        success: false,
        message: 'University name cannot be empty'
      });
    }

    if (universityName !== undefined && universityName.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: 'University name is too long (maximum 200 characters)'
      });
    }

    // Validate studentsServed if provided
    if (studentsServed !== undefined) {
      const studentsCount = parseInt(studentsServed);
      if (isNaN(studentsCount) || studentsCount < 0) {
        return res.status(400).json({
          success: false,
          message: 'Students served must be a valid positive number'
        });
      }

      if (studentsCount > 1000000) {
        return res.status(400).json({
          success: false,
          message: 'Students served number is unreasonably large (maximum 1,000,000)'
        });
      }
    }

    // Validate country and city length if provided
    if (country !== undefined && country && country.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Country name is too long (maximum 100 characters)'
      });
    }

    if (city !== undefined && city && city.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'City name is too long (maximum 100 characters)'
      });
    }

    // Update fields if provided
    if (universityName !== undefined) university.universityName = universityName.trim();
    if (country !== undefined) university.country = country ? country.trim() : '';
    if (city !== undefined) university.city = city ? city.trim() : '';
    if (studentsServed !== undefined) university.studentsServed = parseInt(studentsServed);

    const updatedUniversity = await university.save();

    res.status(200).json({
      success: true,
      message: 'Partnered university updated successfully',
      data: updatedUniversity
    });
  } catch (error) {
    console.error('Error updating partnered university:', error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating partnered university',
      error: error.message
    });
  }
};

// @desc    Delete a partnered university
// @route   DELETE /api/partnered-universities/:id
// @access  Private (Admin only)
const deleteUniversity = async (req, res) => {
  try {
    const university = await PartneredUniversities.findById(req.params.id);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'Partnered university not found'
      });
    }

    await PartneredUniversities.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Partnered university deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting partnered university:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting partnered university',
      error: error.message
    });
  }
};

// @desc    Get universities statistics
// @route   GET /api/partnered-universities/stats/overview
// @access  Public
const getUniversitiesStats = async (req, res) => {
  try {
    const totalUniversities = await PartneredUniversities.countDocuments({});
    const totalStudentsServed = await PartneredUniversities.aggregate([
      {
        $group: {
          _id: null,
          totalStudents: { $sum: '$studentsServed' }
        }
      }
    ]);

    const countriesCount = await PartneredUniversities.distinct('country');
    const citiesCount = await PartneredUniversities.distinct('city');

    res.status(200).json({
      success: true,
      data: {
        totalUniversities,
        totalStudentsServed: totalStudentsServed[0]?.totalStudents || 0,
        uniqueCountries: countriesCount.length,
        uniqueCities: citiesCount.length
      }
    });
  } catch (error) {
    console.error('Error fetching universities statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching universities statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllUniversities,
  getUniversityById,
  getUniversitiesByCountry,
  addUniversity,
  updateUniversity,
  deleteUniversity,
  getUniversitiesStats
};
