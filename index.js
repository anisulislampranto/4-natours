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
// (1.1) CUSTOMIZE MEDDLEWARE
app.use((req, res, next) => {
  console.log('this is middlewere');
  next();
});
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

module.exports = app;
