const csv = require("csv-parser");
const path = require("path");
const fs = require("fs");

const filePath = path.join(__dirname, "../resources/SiteList.csv");

const readCSV = () => {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results); // Resolve the promise with the results
      })
      .on("error", (error) => {
        reject(error); // Reject the promise if there's an error
      });
  });
};

module.exports = readCSV;
