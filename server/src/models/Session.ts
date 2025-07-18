import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  feedback: { type: String },
  rating: { type: Number },
});

export default mongoose.model('Session', sessionSchema);
