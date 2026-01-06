const mongoose = require('mongoose');
const { AdminUser, ROLES } = require('../models/AdminUser');
const dotenv = require('dotenv');

dotenv.config();

const initSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await AdminUser.findOne({ email: 'utkarshsaxena@rediffmail.com' });
    
    if (existingAdmin) {
      console.log('Super admin already exists');
      process.exit(0);
    }

    // Create super admin
    const superAdmin = await AdminUser.create({
      username: 'superadmin',
      email: 'utkarshsaxena@rediffmail.com',
      password: 'Admin@123', // You should change this password after first login
      role: ROLES.SUPER_ADMIN,
      firstName: 'Utkarsh',
      lastName: 'Saxena',
      active: true
    });

    console.log('Super admin created successfully:');
    console.log({
      username: superAdmin.username,
      email: superAdmin.email,
      role: superAdmin.role
    });

    console.log('\nPlease login with:');
    console.log('Email: utkarshsaxena@rediffmail.com');
    console.log('Password: Admin@123');
    console.log('\nIMPORTANT: Please change your password after first login!');

  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

initSuperAdmin(); 