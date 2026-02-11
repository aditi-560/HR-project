const sgMail = require('@sendgrid/mail');

// Configure SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.warn('WARNING: SENDGRID_API_KEY is missing in environment variables. Emails will not be sent.');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendEmail = async (to, subject, html) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SendGrid API Key missing. Skipping email.');
    return false;
  }

  const msg = {
    to,
    from: process.env.EMAIL_FROM || 'noreply@hr-harmony.com', // Must be a verified sender in SendGrid
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('SendGrid Error:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
};

module.exports = sendEmail;
