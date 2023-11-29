const sgMail = require('@sendgrid/mail')
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendActivateEmail = async (name, email, activationString) => {
    const link = "https://classroom-management-be.vercel.app/auth/activate/" 
    + email + "/" + activationString;
    const message = {
      from: 'haq-classroom@yopmail.com',
      to: email,
      subject: 'Email Verification',
      html: `<h1 style="text-align: center ">Welcome HAQ Classroom Management</h1>
      <p style="font-weight: bold;">Hi ${name},</p>
      <p>We just need to verify your email address before you can access HAQ Classroom Management. Please enter this code in the window where you started creating your account<p/>
      <h2 style="font-size: 24px; font-weight: bold; color: #28a745; background-color: #d4edda; padding: 5px 10px; border-radius: 5px; display: inline-block; margin: 10px 0;">${activationString}</h2>
      <p>Thanks! <p/>
      <p>HAQ team</p></h3>`,
    };
  
    try {
      await sgMail.send(message);
      console.log('Sent email');
      return { error: false };
    } catch (error) {
      console.error(error);
      return {
        error: true,
        message: "Cannot send email",
      }
    }
};
  
  module.exports = { sendActivateEmail };