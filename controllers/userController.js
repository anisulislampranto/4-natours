const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  const id = req.params?.id * 1;
  const tour = User.find((el) => el.id === id);
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: "failed",
  //     message: "Invalid Id",
  //   });
  // }
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createUser = catchAsync(async (req, res) => {
  // const newUser = await User.create(req.body);
  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     tour: newUser,
  //   },
  // });
});

exports.deleteUser = (req, res) => {
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'failed delete',
      message: 'Invalid Id',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
