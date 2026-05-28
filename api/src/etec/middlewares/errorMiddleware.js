function handleError(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Erro interno do servidor' : err.message,
  });
}

module.exports = { handleError };
