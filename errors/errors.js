exports.handle404s = (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psql400Errors = ["22P02", "42703", "23502", "23505"];
  const psql404Errors = ["23503"];

  if (psql400Errors.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else if (psql404Errors.includes(err.code)) {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
};
