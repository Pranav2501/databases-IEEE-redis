const { MongoClient } = require('mongodb');
const redis = require('redis');

const client = redis.createClient();
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'ieeevisTweets';
const collectionName = 'tweet';

async function createLeaderboard() {
  await client.connect(); // Connect to Redis
  const mongoClient = new MongoClient(mongoUrl);

  try {
    await mongoClient.connect(); // Connect to MongoDB
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);

    // Aggregate tweet counts by screen_name
    const tweetCounts = await collection.aggregate([
      { $group: { _id: "$user.screen_name", count: { $sum: 1 } } },
      { $sort: { count: -1 } } // Sort in descending order of tweet counts
    ]).toArray();

    // Store the results in a Redis sorted set
    for (const user of tweetCounts) {
      if (user._id) {
        await client.zAdd('leaderboard', { score: user.count, value: user._id });
      }
    }

    // Retrieve and print the top 10 users
    const topUsers = await client.zRangeWithScores('leaderboard', 0, 9, { REV: true });
    console.log("Top 10 Users with Most Tweets:");
    topUsers.forEach((user, index) => {
      console.log(`#${index + 1}: ${user.value} - ${user.score} tweets`);
    });
  } catch (err) {
    console.error('Error creating leaderboard:', err);
  } finally {
    await mongoClient.close();
    client.quit();
  }
}

createLeaderboard().catch(console.error);
