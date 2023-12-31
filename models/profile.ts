import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  photo: {
    type: String,
    required: false,
    validate: {
      validator: function (value: any) {
        return value === null || typeof value === 'string';
      },
      message: 'Invalid photo value',
    },
  },
  name: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  location: {
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  phone: {
    type: String,
    required: true,
  }
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
