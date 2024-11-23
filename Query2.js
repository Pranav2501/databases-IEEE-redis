const { MongoClient } = require('mongodb');
const redis = require('redis');

const client = redis.createClient();
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'ieeevisTweets';
const collectionName = 'tweet';

async function sumFavorites() {
  await client.connect(); 
  const mongoClient = new MongoClient(mongoUrl);

  try {
    await mongoClient.connect(); 
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);

    await client.set('favoritesSum', 0);

    const tweets = await collection.find().toArray();
    for (const tweet of tweets) {
      const favorites = tweet.favorite_count || 0; 
      await client.incrBy('favoritesSum', favorites);
    }

    const sum = await client.get('favoritesSum');
    console.log(`The total number of favorites is ${sum}`);
  } catch (err) {
    console.error('Error computing favorites:', err);
  } finally {
    await mongoClient.close();
    client.quit();
  }
}

sumFavorites().catch(console.error);
