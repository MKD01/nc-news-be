const fs = require('fs');

exports.getApi = (req, res) => {
  return fs.readFile('endpoints.json', 'utf-8', (err, data) => {
    return res.status(200).send(JSON.parse({ data }));
  });
};
