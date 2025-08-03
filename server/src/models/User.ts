import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'mentor' | 'mentee';
  assignedMentor?: mongoose.Types.ObjectId;
  bio?: string;
  skills?: string[];
  goals?: string;
  availability?: string[];
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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
    bio: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    goals: {
      type: String,
      default: '',
    },
    assignedMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    availability: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;