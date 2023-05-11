const seed = require("../db/seeds/seed.js");
const devData = require("../db/data/development-data/index.js");

exports.seedDatabase = (req, res) => {
  seed(devData).then(() => {
    res.status(201).send({ msg: "Database seeded" });
  });
};
