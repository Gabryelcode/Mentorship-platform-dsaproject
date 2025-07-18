// models/MentorshipRequest.ts
import mongoose from 'mongoose';

const mentorshipRequestSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('MentorshipRequest', mentorshipRequestSchema);
