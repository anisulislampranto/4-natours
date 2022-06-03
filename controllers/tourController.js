const tourModel = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// create a checkBody middleware
// Check if body containes the name and price property
// if not, send back 400(bad request)
// add it to post handler stack
// middleware to check for name and price
exports.checkBody = (req, res, next) => {
  console.log(req.body.name);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Fail',
      message: 'Missing Name or Price',
    });
  }
  return next();
};

// (2) ROUTE HANDLERS
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      console.log(err);
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
