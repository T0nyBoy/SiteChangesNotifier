const express = require("express");
require("dotenv").config();
// import routes
const mainRoute = require("./routes/mainRoute.js");
// Import the sites function
const { sites } = require("./functions/scrapSite.js");
// variables
const port = process.env.PORT || 8080;
const app = express();

app.use("/", mainRoute);

// Function to be executed every 3 minutes
const runSitesCheck = () => {
  console.log("Running sites check...");
  sites(); // Call the imported sites() function
  console.log("Sites check completed.");
};

// starting server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  // Run the sites check immediately when the server starts
  runSitesCheck();

  // Set up the interval to run every X minutes (180,000 milliseconds)
  setInterval(runSitesCheck, process.env.RUN_CHEKCS * 60 * 1000); // 3 minutes in milliseconds
});
