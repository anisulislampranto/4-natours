const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// (1) MIDDLEWARE
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// (1.1) CUSTOMIZE MEDDLEWARE

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// (3) ROUTES
// app.get("/api/v1/tours", getAllTours);
// app.post("/api/v1/tours", createTour);
// app.get("/api/v1/tours/:id", getTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// CREATING ROUTER

// USERS

// MOUNTING NEW ROUTER FOR A ROUTE || MIDDLEWARE FOR ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} on this server!`,
  //   });

  const err = new Error(`Can't find ${req.originalUrl} on this`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
