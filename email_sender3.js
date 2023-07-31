const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path')
const app = express();

const  {MongoClient,connectToDatabase}  = require('./mongo');
const {MONGODB_URI,collection_name,EMAIL_ADDRESS,EMAIL_PASSWORD,port} = require('./configure')
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// Replace these with your email credentials


// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD,
  },
});
app.get('/', (req, res) => {
    res.send('Welcome to the Email Sender API!');
  });
app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
  
    try {
      // Connect to the MongoDB database
      const db = await connectToDatabase();
  
      // Assuming you have a collection named 'email2' in your database
      // Retrieve all email recipients from the 'recipients' collection
      const recipientsCollection = db.collection(collection_name);
      const recipients = await recipientsCollection.find({}).toArray();
  
      // Extract the email addresses from the 'email' field of each recipient
      const allRecipients = recipients.map((recipient) => recipient.email);
  
      // Define the email options
      const mailOptions = {
        from: EMAIL_ADDRESS,
        to: allRecipients.join(','), // Join the email addresses into a comma-separated string
        subject,
        text,
        attachments: [], // Initialize an empty array for attachments
      };
  
      // Check if the request contains an 'imagePath' field
    if (req.body.imagePath) {
        // Get the absolute path of the image file
        const imagePath = path.join(__dirname, req.body.imagePath);
    
        // Add the image file as an attachment
        mailOptions.attachments.push({
          path: imagePath,
        });
      }
  
     // Send the email using the Nodemailer transporter
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
          res.status(500).json({ error: 'Failed to send email' });
        } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'Email sent successfully' });
        }
      });
  
    } catch (error) {
      console.log('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });
  