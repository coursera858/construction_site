
export const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors

  console.log(err)
  
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue);
    message = `${field} already exits`;
    statusCode = 409
    errors = [{
      name: field,
      message: `${field} is already taken`
    }]
  }

  res.status(err.statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errors && { errors }),
    data: null
  });
};
