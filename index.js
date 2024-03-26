const functions = require('@google-cloud/functions-framework');
const sequelize = require('./dbConnection.js');
const {checkDatabaseHealth, createToken, createLink, sendVerificationEmail, postEmailLinktoDb } = require('./servicesUtil.js');
const Email = require('./models/Verifyemail.js');
// Register a CloudEvent callback with the Functions Framework that will
// be executed when the Pub/Sub trigger topic receives a message.
functions.cloudEvent('helloPubSub', async (cloudEvent) => {
  // The Pub/Sub message is passed as the CloudEvent's data payload.
  const messageData = JSON.parse(Buffer.from(cloudEvent.data.message.data, 'base64').toString());

  // Extract individual fields from the message data
  const firstname = messageData.firstname || '';
  const lastname = messageData.lastname || '';
  const receiver = messageData.username || '';
  const sender = messageData.sender || '';

  console.log(`Hello, ${firstname} ${lastname}!`);
  console.log(`Send Email to: ${receiver}`);
  console.log(`Send email from: ${sender}`);

  // Recieve all values from pubsub -- done
  // do data base sync
  // do database healthcheck
  // call uuid service to generate token
  // make the verification link
  // send the verification link - call mail service
  // call the postLink service to make the database entry

  try {
    // Check database health
    // const status = await checkDatabaseHealth();
    // console.log(status);
    try {
      await sequelize.authenticate();
      console.log('######### Connection successful #########');
    } catch (error) {
      console.error('######### Connection Unsuccessful #########', error);
    }

    console.log("healthchecked");

    //  Sync database
    sequelize.sync({ alter: true }).then(() => {
      console.log('Database synced successfully');
    })
  
      .catch((error) => {
        logger.error('Error syncing database', error);
        console.error('Error syncing database');
      });
     console.log("database synced");

   
    // Create token
    const newToken = await createToken();
    console.log(newToken);

    // Create verification link
    const verificationLink = await createLink(receiver, newToken);
    console.log(verificationLink);

    // Send verification email
    await sendVerificationEmail({
      to: receiver,
      from: sender,
      firstname: firstname,
      lastname: lastname,
      verificationLink: verificationLink
    });

    // Make entry in database
    await postEmailLinktoDb(receiver, newToken, verificationLink);

    console.log('Process completed successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
});