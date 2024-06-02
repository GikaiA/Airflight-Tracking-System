const bcrypt = require('bcryptjs');

const testBcrypt = async () => {
  const password = 'testuser12';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed Password:', hashedPassword);

  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('Password match:', isMatch);
};

testBcrypt();
