const { ObjectId } = require('mongodb');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // try {
  // execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .panginate();

  const tours = await features.query;

  //  mongoose filtering
  // const query = Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  // send query
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: 'Failed to fetch data',
  //   });
  // }
});

exports.getTour = catchAsync(async (req, res, next) => {
  // try {
  const tour = await Tour.findById({ _id: ObjectId(req.params.id) }).populate(
    'reviews'
  );
  // Tour.findOne({ _id: req.params.id });

  if (!tour) {
    return next(new AppError('No tour Found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: 'failed to load single data',
  //   });
  // }
});

exports.createTour = handlerFactory.createOne(Tour);
exports.updateTour = handlerFactory.updatOne(Tour);
exports.deleteTour = handlerFactory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: '$ratingsAverage',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        mixPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // } catch (error) {
  //   req.status(404).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  // } catch (error) {
  //   req.status(404).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
});
