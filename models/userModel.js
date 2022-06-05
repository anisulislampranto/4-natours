const mongoose = require('mongoose');
const validator = require('validator');

// name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us Your Name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide you email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide Valid Email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please Provide a password'],
    minlength: 8,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
