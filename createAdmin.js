const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGODB_URI = 'mongodb+srv://cloudbookingsolutions4:saurabh0701@paint-warrier.zznhqpi.mongodb.net/?retryWrites=true&w=majority&appName=Paint-warrier';

const createAdmin = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB Atlas');

    // Check if admin already exists
    let adminUser = await User.findOne({ username: 'admin' });
    
    if (adminUser) {
      console.log('Admin user exists, updating password...');
      // Update the password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser.password = hashedPassword;
      await adminUser.save();
      console.log('Admin password updated successfully');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = new User({
        username: 'admin',
        password: hashedPassword,
        isAdmin: true
      });
      await adminUser.save();
      console.log('New admin user created successfully');
    }

    // Verify the user was saved correctly
    const savedUser = await User.findOne({ username: 'admin' });
    console.log('Saved user:', {
      username: savedUser.username,
      isAdmin: savedUser.isAdmin,
      _id: savedUser._id
    });

    // Test password verification
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, savedUser.password);
    console.log('Password verification test:', {
      testPassword,
      isMatch
    });

    console.log('\nUse these credentials to log in:');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin(); 