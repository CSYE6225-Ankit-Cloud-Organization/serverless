const { sequelize } = require('./dbConnection');
const { v4: uuidv4 } = require('uuid');
const sgMail = require('@sendgrid/mail');
const Verifyemail = require('./models/Verifyemail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function checkDatabaseHealth() {
  try {
    await sequelize.authenticate();
    console.log('######### Connection successful #########');
    return true;
  } catch (error) {
    console.error('######### Connection Unsuccessful #########', error);
    return false;
  }
}

async function createToken() {
  try {
    // Generate UUIDv4 for token
    const token = uuidv4();
    return token;
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
}

async function createLink(email, token) {
  try {

    const verificationLink = `http://${process.env.SENDER_DOMAIN}:${APP_PORT}/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
    return verificationLink;
  } catch (error) {
    console.error('Error creating link:', error);
    throw error;
  }
}

async function sendVerificationEmail({ to, from, firstname, lastname, verificationLink }) {
  const msg = {
    to: to,
    from: from,
    subject: "Verifiaiton Email",
    templateId: 'd-081ed3845ddf48fa8407481345dc0863',
    dynamic_template_data: {
      firstname: firstname,
      verificationlink: verificationLink
    }

  };

  try {
    await sgMail.send(msg);
    console.log('Email sent');
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error up to the caller
  }
}

async function postEmailLinktoDb(receiver, token, verificationLink) {
  try {
    // Create a new instance of the Verifyemail model with dummy values
    const dummyEmail = await Verifyemail.create({
      username: receiver,
      token: token,
      email_link: verificationLink
    });

    console.log('Dummy entry created successfully:', dummyEmail.toJSON());
  } catch (error) {
    console.error('Error creating dummy entry:', error);
    throw error;
  }
}

module.exports = { checkDatabaseHealth, createToken, createLink, sendVerificationEmail, postEmailLinktoDb };
