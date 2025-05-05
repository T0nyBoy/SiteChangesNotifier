const transporter = require("../utils/nodemailerTransporter");
const path = require("path");

const emailSend = async (urlName, url) => {
  const mailOptions = {
    from: `"Site Compare Script" <${process.env.EMAIL_FROM}>`, // sender address
    to: process.env.EMAIL_TO,
    subject: `Changes found to ${urlName}`, // Subject line

    html: `<b>Hello. Changes found to ${urlName} you are tracking.</b>
    </br>
    <b>Visit the site here:</b> ${url}
    `, // html body
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.log("Error Here: ", error);
  }
};

module.exports = { emailSend };
