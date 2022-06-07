const AppError = require('../utils/appError');

const handleJwtError = () => {
  new AppError('Invalid token, Please log in again!', 401);
};
const handleJwtExpiredError = () => {
  new AppError('Your token has expired! please log in again', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming or other unknown error: don't want to leak error details to client
  } else {
    // 1) Log Error
    console.error('ERROR', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'Error',
      message: 'Something went very wrong ',
    });
  }
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'JsonWebTokenError') {
      return (error = handleJwtError());
    }
    if (error.name === 'TokenExpiredError') {
      return (error = handleJwtExpiredError());
    }

    sendErrorProd(err, res);
  }
};
