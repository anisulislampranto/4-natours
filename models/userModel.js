const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
  confirmPassword: {
    type: String,
    required: [true, 'Please Confirm your password'],
    validate: {
      // this only works on CREATE && SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  // Only Runs this function if passwords was actually modified
  if (!this.isModified('password')) {
    next();
  } else {
    // Hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12);

    // delete confirmPassword field
    this.confirmPassword = undefined;
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
