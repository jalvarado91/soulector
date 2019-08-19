const MongoClient = require("mongodb").MongoClient;

let MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

console.log(MONGO_CONNECTION_STRING);

async function connectToDB() {
  const client = new MongoClient(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true
  });
  await client.connect();
  return client;
}

async function getAllTracks() {
  const client = await connectToDB();

  const trackCollection = client.db("soulector").collection("tracks");
  let allTracks = await trackCollection
    .find({})
    .sort({
      created_time: 1
    })
    .toArray();

  await client.close();

  return allTracks;
}

export async function handler(event, context) {
  try {
    let tracks = await getAllTracks();
    console.log("successfully retrieved tracks");
    return {
      statusCode: 200,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ tracks: tracks })
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
}
