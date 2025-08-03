// src/models/Session.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  mentor: mongoose.Types.ObjectId;
  mentee: mongoose.Types.ObjectId;
  date: Date;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

const sessionSchema = new Schema<ISession>(
  {
    mentor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mentee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending', // ✅ Add this line
    },
  },
  { timestamps: true }
);

const Session = mongoose.model<ISession>('Session', sessionSchema);
export default Session;
