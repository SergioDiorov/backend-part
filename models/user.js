import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  personalData: {
    gender: String,
    birthDate: String,
    location: String,
    phone: Number,
  },
});

const User = mongoose.model('User', usersSchema);

export default User;
