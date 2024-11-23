const { MongoClient } = require('mongodb');
const redis = require('redis');

const client = redis.createClient();
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'ieeevisTweets';
const collectionName = 'tweet';

async function sumFavorites() {
  await client.connect(); // Connect to Redis
  const mongoClient = new MongoClient(mongoUrl);

  try {
    await mongoClient.connect(); // Connect to MongoDB
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);

    // Initialize the Redis key
    await client.set('favoritesSum', 0);

    // Aggregate the total favorite_count
    const tweets = await collection.find().toArray();
    for (const tweet of tweets) {
      const favorites = tweet.favorite_count || 0; // Use 'favorite_count' or default to 0
      await client.incrBy('favoritesSum', favorites);
    }

    // Get and print the total from Redis
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
