const { MongoClient } = require('mongodb');
const {MONGODB_URI} = require('./configure');

// Replace the following connection string with your actual MongoDB connection string
 // mongodb connection string has to be accessed globally.
// for an example : mongodb+srv://jeetnandigrami2003:jeet%402003@cluster0.8lc9vfo.mongodb.net/demo
// collection_name : email2.

// Function to connect to the MongoDB database
async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
    await client.connect();
    return client.db();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}
module.exports ={
    MongoClient,
    connectToDatabase,
};