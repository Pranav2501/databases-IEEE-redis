const { MongoClient } = require('mongodb');
const redis = require('redis');

const client = redis.createClient();
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'ieeevisTweets';
const collectionName = 'tweet';

async function countDistinctUsers() {
  await client.connect(); // Connect to Redis
  const mongoClient = new MongoClient(mongoUrl);

  try {
    await mongoClient.connect(); // Connect to MongoDB
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);

    // Get all tweets and extract unique screen names
    const tweets = await collection.find({}, { projection: { "user.screen_name": 1 } }).toArray();
    
    for (const tweet of tweets) {
      if (tweet.user && tweet.user.screen_name) {
        await client.sAdd('screen_names', tweet.user.screen_name); // Add to Redis set
      }
    }

    // Count the unique screen names in the Redis set
    const distinctCount = await client.sCard('screen_names');
    console.log(`There are ${distinctCount} distinct users.`);
  } catch (err) {
    console.error('Error computing distinct users:', err);
  } finally {
    await mongoClient.close();
    client.quit();
  }
}

countDistinctUsers().catch(console.error);
