const { AdminUser } = require("../models/AdminUser");
const { RegisteredStudent } = require("../models/registeredUserModel");
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');


const createRegisteredStudent = async(req, res) => {
    const { name,gender, email, dob, password,phone, studyDestination,intendedCourse,preferedUniversity,assignedCounselor,address, notes } = req.body;
  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await RegisteredStudent.create({ 
      name,
      gender, 
      email, 
      dob, 
      password: hashedPassword,
      phone,
      address, 
      studyDestination,
      intendedCourse,
      preferedUniversity,
      assignedCounselor, 
      notes 
    });
    
    res.status(201).json({
      success:true,
      message:'Student enrolled successfully',
      data:newUser
    });
  } catch (error) {
    console.error('Error creating registered student:', error);
    res.status(500).json({ error: 'Failed to create registered student' });
  }
};

const loginRegisteredStudent = async(req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await RegisteredStudent.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (user.accountStatus !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive or suspended. Please contact support.'
      });
    }

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login date
    user.lastLoginDate = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user data without password
    const { password: _, ...rest } = user._doc;
    
const userData = { ...rest, role: "registered-student" };


    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}



const getSingleRegisteredStudent = async (req, res) => {
  try {
    const user = await RegisteredStudent.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching registered user:', error);
    res.status(500).json({ error: 'Failed to fetch registered user' });
  }
};

// Get current user profile (authenticated user)
const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await RegisteredStudent.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Add role to the response
    const userData = { ...user._doc, role: "registered-student" };
    
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user profile' 
    });
  }
};

const getAllRegisteredStudents = async (req, res) => {
  try {
    const users = await RegisteredStudent.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching registered students:', error);
    res.status(500).json({ error: 'Failed to fetch registered students' });
  }
};

const updateRegisteredStudent = async (req, res) => {
  const { id } = req.params;
  const { assignedCounsellor,assignedCounsellorName } = req.body;
  try {
    const updatedStudent = await RegisteredStudent.findByIdAndUpdate(
      id,
      { assignedCounsellor,assignedCounsellorName },
      { new: true }
    );
    console.log("updatedStudent",updatedStudent);
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
  res.status(200).json({success:true,data:updatedStudent});
  } catch (error) {
    console.error('Error updating registered student:', error);
    res.status(500).json({ error: 'Failed to update registered student' });
  }
};

const deleteRegisteredStudent = async (req, res) => {

  const { id } = req.params;
  try {
    await RegisteredStudent.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting registered student:', error);
    res.status(500).json({ error: 'Failed to delete registered student' });
  }
};


// Document Admin Functions

const updateDocumentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedDocument = await RegisteredStudent.findByIdAndUpdate(
      id,
      { documentsUploadStatus: status },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ error: 'Document not found' });
    }
    console.log('here')
    res.status(200).json(updatedDocument);
  } catch (error) {
    console.error('Error updating document status:', error);
    res.status(500).json({ error: 'Failed to update document status' });
  }
};

const updateDocumentConditionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { documentName } = req.body;

  try {
    const updatedStudent = await RegisteredStudent.findOneAndUpdate(
      { _id: id, "documents.name": documentName },   // find student + specific doc
      { $set: { "documents.$.status": status } },    // update only that doc’s status
      { new: true }                                  // return updated doc
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Document not found' });
    }
    console.log('here')
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Error updating document status:', error);
    res.status(500).json({ error: 'Failed to update document status' });
  }
};

const sendRemark = async (req, res) => {
  const { id } = req.params;  
  const { remark, studentEmail } = req.body;

  try {
    const updatedStudent = await RegisteredStudent.findByIdAndUpdate(
      id,
      { remark: remark },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Send email to the student about the remark
    try {
      const { sendEmail } = require('../utils/email');
      
      const emailSubject = 'Document Remark Update - Edurizon';
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Edurizon</h1>
            <p style="color: white; margin: 5px 0 0 0; opacity: 0.9;">Document Management System</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #374151; margin-bottom: 20px;">Document Remark Update</h2>
            
            <p style="color: #6B7280; line-height: 1.6; margin-bottom: 20px;">
              Hello <strong>${updatedStudent.name}</strong>,
            </p>
            
            <p style="color: #6B7280; line-height: 1.6; margin-bottom: 20px;">
              A remark has been added to your document by our administrative team. Please review the details below:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981; margin: 20px 0;">
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 18px;">Remark Details:</h3>
              <p style="color: #374151; line-height: 1.6; margin: 0; font-style: italic;">
                "${remark}"
              </p>
            </div>
            
            <p style="color: #6B7280; line-height: 1.6; margin-bottom: 20px;">
              Please take necessary action based on this remark. If you have any questions or need clarification, 
              please don't hesitate to contact our support team.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:support@edurizon.com" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
                Contact Support
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
            
            <p style="color: #9CA3AF; font-size: 14px; text-align: center; margin: 0;">
              This is an automated message from Edurizon. Please do not reply to this email.
            </p>
          </div>
        </div>
      `;
      console.log('studentEmail', studentEmail);
      console.log('emailSubject', emailSubject);
      const emailResult = await sendEmail({
        email: studentEmail,
        subject: emailSubject,
        html: emailHtml
      });

      if (emailResult.success) {
        console.log('✅ Remark email sent successfully to:', studentEmail);
      } else {
        console.error('❌ Failed to send remark email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ Error sending remark email:', emailError);
      // Don't fail the main request if email fails
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Error sending remark:', error);
    res.status(500).json({ error: 'Failed to send remark' });
  }
};

const deleteOneDocument = async(req,res)=>{
  const { id } = req.params;
  const { documentName } = req.body;

  try {
    // Find the student and remove the document with the specified name
    const updatedStudent = await RegisteredStudent.findByIdAndUpdate(
      id,
      { $pull: { documents: { name: documentName } } },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if the document was actually removed
    const documentExists = updatedStudent.documents.find(doc => doc.name === documentName);
    if (documentExists) {
      return res.status(400).json({ error: 'Document not found or could not be deleted' });
    }

    res.status(200).json({ 
      message: 'Document deleted successfully', 
      student: updatedStudent 
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
}

const addOneDocument = async (req,res)=>{
  const { id } = req.params;
  const { name } = req.body;


  try {
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Document name is required' });
    }

    // Check if document with same name already exists
    const existingStudent = await RegisteredStudent.findById(id);

    if (!existingStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const documentExists = existingStudent.documents.find(doc => doc.name === name);
    if (documentExists) {
      return res.status(400).json({ error: 'Document with this name already exists' });
    }
    // Create new document object
    const newDocument = {
      name,
      link: '',
      status: 'pending',
      remark:  ''
    };

    // Add the document to the student's documents array
    const updatedStudent = await RegisteredStudent.findByIdAndUpdate(
      id,
      { $push: { documents: newDocument } },
      { new: true }
    );

    res.status(201).json({ 
      message: 'Document added successfully', 
      student: updatedStudent 
    });
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).json({ error: 'Failed to add document' });
  }
}


const addVideoData=async(req,res)=>{
  try {
    const { id } = req.params; // pass userId in route
    const {
      videoName,
      dateOfShoot,
      videoEdited,
      thumbnailUploaded,
      captionAdded,
      videoUploaded,
      platform,
      uploadDate,
      description
    } = req.body;

    // Video object to add
    const newVideo = {
      videoName,
      dateOfShoot,
      videoEdited: videoEdited || false,
      thumbnailUploaded: thumbnailUploaded || false,
      captionAdded: captionAdded || false,
      videoUploaded: videoUploaded || false,
      platform: platform || [],
      uploadDate,
      description,
    };

    // Push video into user's digitalMarketingVideos
    const updatedUser = await AdminUser.findByIdAndUpdate(
      id,
      { $push: { digitalMarketingVideos: newVideo } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Video added successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get registered students by counsellor
// @route   GET /api/registered-students/get-by-counsellor/:counsellorId
// @access  Private
const getRegisteredStudentsByCounsellor = async (req, res) => {
  try {
    const { counsellorId } = req.params;
    
    const students = await RegisteredStudent.find({ assignedCounsellor: counsellorId })
      .populate('assignedCounsellor', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error fetching registered students by counsellor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registered students by counsellor',
      error: error.message
    });
  }
};

const uploadDocument = async (req, res) => {
  const { id } = req.params;
  const { documentName } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!documentName) {
      return res.status(400).json({ error: 'Document name is required' });
    }

    // Upload file to Cloudinary
    const { uploadToCloudinary } = require('../utils/cloudinary');
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, 'edurizon/documents');

    // Find the student and add the document
    const student = await RegisteredStudent.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Find and update the existing document by the document name passed from frontend
    const existingDocumentIndex = student.documents.findIndex(doc => doc.name === documentName);
    
    if (existingDocumentIndex !== -1) {
      // Update existing document's link and status
      student.documents[existingDocumentIndex].link = cloudinaryResult.secure_url;
      student.documents[existingDocumentIndex].status = 'uploaded';
      // Keep existing remark if any
    } else {
      // This should not happen in normal flow since we're uploading to an existing document
      console.error('Document not found:', documentName);
      return res.status(404).json({ error: 'Document not found to update' });
    }
    
    await student.save();

    res.status(200).json({
      message: 'Document uploaded successfully',
      document: student.documents[existingDocumentIndex]
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

module.exports = {
  createRegisteredStudent,
  getSingleRegisteredStudent,
  getAllRegisteredStudents,
  updateRegisteredStudent,
  updateDocumentStatus,
  updateDocumentConditionStatus,
  sendRemark,
  deleteOneDocument,
  addOneDocument,
  addVideoData,
  deleteRegisteredStudent,
  getRegisteredStudentsByCounsellor,
  loginRegisteredStudent,
  getCurrentUserProfile,
  uploadDocument
};
