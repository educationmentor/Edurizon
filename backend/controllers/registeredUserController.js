const { RegisteredStudent } = require("../models/registeredUserModel");


const createRegisteredStudent = async(req, res) => {
    const { name,gender, email, dob, password,phone, studyDestination,intendedCourse,preferedUniversity,assignedCounselor,address, notes } = req.body;
  try {
    const newUser = await RegisteredStudent.create({ name,gender, email, dob, password,phone,address, studyDestination,intendedCourse,preferedUniversity,assignedCounselor, notes });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating registered student:', error);
    res.status(500).json({ error: 'Failed to create registered student' });
  }
};

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

const getAllRegisteredStudents = async (req, res) => {
  try {
    const users = await RegisteredStudent.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching registered students:', error);
    res.status(500).json({ error: 'Failed to fetch registered students' });
  }
};

module.exports = {
  createRegisteredStudent,
  getSingleRegisteredStudent,
  getAllRegisteredStudents
};