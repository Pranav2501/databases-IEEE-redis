const { MongoClient } = require('mongodb');
const redis = require('redis');

const client = redis.createClient();
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'ieeevisTweets';
const collectionName = 'tweet';

async function organizeTweetsByUser() {
  await client.connect(); // Connect to Redis
  const mongoClient = new MongoClient(mongoUrl);

  try {
    await mongoClient.connect(); // Connect to MongoDB
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch all tweets
    const tweets = await collection.find().toArray();

    for (const tweet of tweets) {
      if (tweet.user && tweet.user.screen_name) {
        const screenName = tweet.user.screen_name;
        const tweetId = tweet.id_str;

        // Add tweet ID to the Redis list for the user's screen_name
        await client.rPush(`tweets:${screenName}`, tweetId);

        // Add the full tweet attributes to a Redis hash keyed by the tweet ID
        const tweetKey = `tweet:${tweetId}`;
        const tweetAttributes = {
          user_name: screenName,
          text: tweet.text,
          created_at: tweet.created_at,
          favorite_count: tweet.favorite_count || 0,
          retweet_count: tweet.retweet_count || 0,
        };
        await client.hSet(tweetKey, tweetAttributes);
      }
    }

    console.log("Tweets organized by user successfully!");
  } catch (err) {
    console.error('Error organizing tweets by user:', err);
  } finally {
    await mongoClient.close();
    client.quit();
  }
}

organizeTweetsByUser().catch(console.error);
