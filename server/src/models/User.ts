// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import { ref } from 'process';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'mentor' | 'mentee';
  assignedMentor?: mongoose.Types.ObjectId; // <- Add this line
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // or false if optional
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'mentor', 'mentee'],
      default: 'mentee',
    },
    // Add other fields like skills, availability, etc.
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;