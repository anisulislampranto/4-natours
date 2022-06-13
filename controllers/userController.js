const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');

const filterObj = (obj, ...alowedFeilds) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (alowedFeilds.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create Error if user POSTs password data
  if (req.body.passwprd || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPassword',
        400
      )
    );
  }

  // filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update User document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
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

exports.deleteUser = handlerFactory.deleteOne(User);
