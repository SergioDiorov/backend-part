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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  profileCount: {
    type: Number,
    default: 0,
  },
  profiles: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile',
  }],
});

const User = mongoose.model('User', usersSchema);

export default User;
