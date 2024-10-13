const fs = require("fs");
const { selectTopics } = require("../models/topics.models");

exports.getApi = (req, res) => {
  return fs.readFile("endpoints.json", "utf-8", (err, data) => {
    return res.status(200).send(JSON.parse(data));
  });
};

exports.getStatus = (req, res) => {
  return selectTopics().then(() => {
    res.sendStatus(200);
  });
};
