import mongoose, { Document, Schema, Model } from 'mongoose';

// TypeScript interface for the Request document
export interface IRequest extends Document {
  mentee: mongoose.Types.ObjectId;
  mentor: mongoose.Types.ObjectId;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Define schema
const requestSchema: Schema<IRequest> = new Schema(
  {
    mentee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mentor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// ✅ Renamed model name to avoid conflicts with Express.Request
const MentorshipRequest: Model<IRequest> = mongoose.model<IRequest>('MentorshipRequest', requestSchema);

export default MentorshipRequest;
