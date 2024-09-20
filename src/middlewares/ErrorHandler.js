export default function ErrorHandler(error, req, res, next) {
  res.json({
    type: "Fail",
    message: error.message,
  });
}
