const bcrypt = require('bcryptjs');

const password = 'testuser12';

async function testHash() {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed Password:', hashedPassword);

  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('Password match:', isMatch);
}

testHash();
