import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  name: String,
  email: String,
  skills: [String],
  goals: String,
  role: { type: String, default: 'mentor' },
});

const Mentor = mongoose.model('Mentor', mentorSchema);
export default Mentor;
