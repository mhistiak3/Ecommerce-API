export default function ErrorHandler(error, req, res, next) {
  res.status(500).json({
    type: "Fail",
    message: error.message,
  });
}
