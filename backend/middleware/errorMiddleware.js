
const notFound = (req, res, next) => { // this is for routing address not found
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);//for go next
  };
  
  const errorHandler = (err, req, res, next) => { //even after it gives other error it comes here 
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);//it return the error code then json msg
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };
  
  module.exports = { notFound, errorHandler };