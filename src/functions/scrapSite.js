const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const readCSV = require("../functions/csvImport");
const { emailSend } = require("../functions/emailSend");

const FetchHTML = async (url) => {
  try {
    // Launching a headless browser
    const browser = await puppeteer.launch();
    // Creating a new page
    const page = await browser.newPage();

    // Navigating to a website
    await page.goto(url);

    // Waiting for network activity to be idle for at least 500 milliseconds
    await page.waitForFunction(
      "window.performance.timing.loadEventEnd - window.performance.timing.navigationStart >= 500"
    );
    // Getting the page source HTML
    const pageSourceHTML = await page.content();

    // Extracting The Body
    const htmlBody = await page.$("body");

    // Extracting and logging the text content of the element
    const htmlBodyText = await page.evaluate(
      (htmlBody) => htmlBody.textContent,
      htmlBody
    );
    // Closing the browser
    await browser.close();
    return htmlBodyText;
  } catch (error) {
    console.log(`Error Fetching ${url}`, error);
    throw error;
  }
};

const readFile = (urlName) => {
  const filePath = path.join(__dirname, `../sitesHTML/${urlName}.txt`);
  const fileData = fs.readFileSync(filePath, "utf8");
  return fileData;
};

const saveHTMLToFile = async (url, urlName) => {
  try {
    // creating the file path
    const filePath = path.join(__dirname, `../sitesHTML/${urlName}.txt`);
    // fetching the data
    const htmlData = await FetchHTML(url);
    // checking if the file already exists
    if (fs.existsSync(filePath)) {
      console.log("File already exists");
      // comparing the data
      htmlData === readFile(urlName)
        ? console.log(`No changes found on ${urlName}`)
        : (fs.writeFileSync(filePath, htmlData),
          emailSend(urlName, url),
          console.log(
            `File ${urlName}.txt updated successfully at ${filePath}`
          ));
    } else {
      fs.writeFileSync(filePath, htmlData);
      console.log(`File ${urlName}.txt created successfully at ${filePath}`);
    }
  } catch (error) {
    console.error("Error in saving HTML:", error);
  }
};

const sites = async () => {
  const sitesData = await readCSV();
  for (let i = 0; i < sitesData.length; i++) {
    saveHTMLToFile(sitesData[i].url, sitesData[i].urlName);
  }
};

module.exports = { sites };
