const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');

// a complete defination of how we want to store our files with the destination and the filename
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // first arg is an error if there is one is not then just null
//     // second arg is the actual destination
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-68767kah87-875756687.jpg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

// in this function, the goal is basically to test if the uploaded file is an image
// if it is so then we pass true into the above cb funtion line:17
// if it is not then we pass false into the callback function along with an error
// note: its not only for images its for all kinds of file depands on the application you are making
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Pleae upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

// it will run right after the photo is uploaded and that upload is now heppening to a buffer and
// no longer directly to the file system. so thats why we used memory storage line:22
// resizing the image from memory and then storing it to diskstorage
// note: if you do not need image proccesing then use line:8-line:20 method
exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const filterObj = (obj, ...alowedFeilds) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (alowedFeilds.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);

  // 1) Create Error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPassword',
        400
      )
    );
  }

  // filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

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

exports.createUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

exports.getUser = handlerFactory.getOne(User);
exports.getAllUsers = handlerFactory.getAll(User);

// for admin // do not update password with this
exports.updateUser = handlerFactory.updatOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
