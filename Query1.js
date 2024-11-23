const { MongoClient } = require('mongodb');
const redis = require('redis');

const client = redis.createClient();
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'ieeevisTweets';


async function countTweets() {
  await client.connect();
  const mongoClient = new MongoClient(mongoUrl);
  try {
    await mongoClient.connect();
    const db = mongoClient.db(dbName);
    const collection = db.collection('tweet');
    
    const tweetCount = await collection.countDocuments();
    await client.set('tweetCount', 0);
    await client.incrBy('tweetCount', tweetCount);
    
    const count = await client.get('tweetCount');
    console.log(`There were ${count} tweets`);
  } finally {
    await mongoClient.close();
    client.quit();
  }
}

countTweets().catch(console.error);
