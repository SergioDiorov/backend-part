import User from '../models/user';

const handleError = (res, error) => {
  res.status(500).json({ error });
};

export const getUsers = async (req, res) => {
  try {
    let users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    handleError(res, err);
  }
};

export const getUserById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    handleError(res, err);
  }
};

export const postNewUser = async (req, res) => {
  try {
    const user = new User(req.body);
    let result = await user.save();
    res.status(201).json(result);
  } catch (err) {
    handleError(res, err);
  }
};

export const changeUserData = async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    let result = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    handleError(res, err);
  }
};
