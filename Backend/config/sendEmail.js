const { Resend } = require("resend");
const dotenv = require("dotenv");
dotenv.config();

if (!process.env.RESEND_API_KEY) {
  console.log("resend api key is not present in .env file");
}
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    console.log("html", html);
    const { data, error } = await resend.emails.send({
      from: "addaCollection <onboarding@resend.dev>",
      to: sendTo,
      subject: subject,
      html: html,
    });
    if (error) {
      return console.error({ error });
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmail };
