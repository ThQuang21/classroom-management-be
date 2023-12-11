const sgMail = require('@sendgrid/mail')
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailInviteTeacher = async (email, classCode, invitationCode, teacherName, className) => {
    const link = "http://localhost:3001/join-class/" 
    + classCode + "?inviteC=" + invitationCode;

    const message = {
      from: 'haq-classroom@yopmail.com',
      to: email,
      subject: 'Invitation to teach class: ' + className,
      html: `<h1 style="text-align: center ">Welcome HAQ Classroom Management</h1>
      <p style="font-weight: bold;">Hi there,</p>
      <p> ${teacherName} has invited you to join the class <strong>${className}</strong> on HAQ Classroom Management as the teacher. Please click this <a clicktracking="off" href='${link}'>link</a> to join.</p>
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
  
  module.exports = { sendEmailInviteTeacher };