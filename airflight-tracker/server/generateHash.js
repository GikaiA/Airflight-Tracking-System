const bcrypt = require('bcryptjs');

const generateHash = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Manually generated hashed password:', hashedPassword);
};

// Replace 'testuser12' with the actual password used during registration
generateHash('testuser12');
