import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
console.log('URI:', process.env.MONGODB_URI);
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected successfully!');
  process.exit(0);
} catch(e) {
  console.error('Full error:', e);
  process.exit(1);
}
