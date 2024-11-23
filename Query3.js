const { MongoClient } = require('mongodb');
const redis = require('redis');

const client = redis.createClient();
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'ieeevisTweets';
const collectionName = 'tweet';

async function countDistinctUsers() {
  await client.connect(); 
  const mongoClient = new MongoClient(mongoUrl);

  try {
    await mongoClient.connect(); 
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);

    const tweets = await collection.find({}, { projection: { "user.screen_name": 1 } }).toArray();
    
    for (const tweet of tweets) {
      if (tweet.user && tweet.user.screen_name) {
        await client.sAdd('screen_names', tweet.user.screen_name); 
      }
    }

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
