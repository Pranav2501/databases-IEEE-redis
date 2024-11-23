const { MongoClient } = require('mongodb');
const redis = require('redis');

const client = redis.createClient();
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'ieeevisTweets';
const collectionName = 'tweet';

async function createLeaderboard() {
  await client.connect(); 
  const mongoClient = new MongoClient(mongoUrl);

  try {
    await mongoClient.connect(); 
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);

    const tweetCounts = await collection.aggregate([
      { $group: { _id: "$user.screen_name", count: { $sum: 1 } } },
      { $sort: { count: -1 } } 
    ]).toArray();

    for (const user of tweetCounts) {
      if (user._id) {
        await client.zAdd('leaderboard', { score: user.count, value: user._id });
      }
    }

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
