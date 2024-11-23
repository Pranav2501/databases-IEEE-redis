# Redis Database - IEEEVis 2020 Tweets Project

This repository contains scripts for managing and analyzing tweets collected during the 2020 IEEEVis Conference. The Node.js scripts interact with MongoDB and Redis to perform various queries and store data efficiently. Queries include counting tweets, aggregating favorite counts, creating leaderboards, and organizing tweets by user using Redis data structures.

## Prerequisites
- Node.js and npm
- MongoDB (using Docker or MongoDB Atlas)
- Redis Stack (for advanced Redis capabilities)
- MongoDB tools (e.g., `mongoimport`)
- A tool to unzip files (e.g., Keka or 7zip)

## Installation

### Step 0: Clone the Repository
To get started, clone this repository to your local machine:
```sh
git clone <repository-url>
cd ieeevis2020-tweets-project
```

### Step 1: Set Up Redis Stack

#### Install Redis Stack using Brew (macOS)
```sh
brew install redis-stack
```

#### Start Redis Stack
```sh
redis-stack-server
```

### Install Redis Insight
Redis Insight is a graphical user interface that allows you to visualize and manage Redis data.

1. Visit the Redis Insight download page: [Redis Insight](https://redis.com/redis-enterprise/redis-insight/).
2. Download and install Redis Insight for your platform.

After installation, launch Redis Insight and connect it to your local Redis instance at `localhost:6379`.

### Step 2: Install MongoDB

#### Option 1: Install MongoDB with Docker
1. Install Docker: [Docker Installation](https://docs.docker.com/get-docker/).
2. Run the following command to start a MongoDB container:
   ```sh
   docker run --name mongodb -d -p 27017:27017 mongo
   ```

#### Option 2: Set Up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Follow the instructions to connect to your cluster. Make sure to note the connection string.

### Step 3: Import IEEEVis 2020 Tweets Dataset

1. **Download the Dataset**: Download the tweets collected during the IEEEVis 2020 conference: [IEEEVis 2020 Tweets](https://johnguerra.co/viz/influentials/ieeevis2020/ieeevis2020Tweets.dump.bz2).

2. **Unzip the File**: You can use a tool like Keka or 7zip to extract the `.dump` file:
   - [Keka](https://www.keka.io/en/)
   - [7zip](https://www.7-zip.org/)

3. **Import Data to MongoDB**:
   ```sh
   mongoimport -h localhost:27017 -d ieeevisTweets -c tweet --file ieeevis2020Tweets.dump
   ```

If you're using MongoDB Atlas, replace `-h localhost:27017` with your MongoDB Atlas connection details.

## Running the Queries

### Step 1: Install Node.js Dependencies
1. Install Node.js dependencies by running the following command:
   ```sh
   npm install
   ```

### Step 2: Run the Queries

There are five queries in the project, each defined in its own JavaScript file:

1. **Query 1**: Count the number of tweets.
   ```sh
   node query1.js
   ```

2. **Query 2**: Compute the total number of favorites.
   ```sh
   node query2.js
   ```

3. **Query 3**: Compute how many distinct users are there in the dataset.
   ```sh
   node query3.js
   ```

4. **Query 4**: Create a leaderboard of the top 10 users with the most tweets.
   ```sh
   node query4.js
   ```

5. **Query 5**: Organize tweets by user, using lists for tweet IDs and hashes for tweet details.
   ```sh
   node query5.js
   ```

### Connecting to Redis and MongoDB
- Redis is expected to be running on `localhost:6379`.
- MongoDB is expected to be running on `localhost:27017`.
- Update the connection strings in the query files if your services are running elsewhere.

## Video Tutorial
A video tutorial on setting up the environment and running the queries can be found here: [YouTube Video Placeholder](https://www.youtube.com/placeholder).

## Summary
These scripts allow for efficient storage and retrieval of Twitter data using MongoDB and Redis, enabling you to perform a variety of data analysis tasks. Follow the steps above to set up the environment, load the dataset, and run each query to explore the data collected during the 2020 IEEEVis Conference.
