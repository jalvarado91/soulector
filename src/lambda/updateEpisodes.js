const axios = require("axios");
var _ = require("lodash");
const MongoClient = require("mongodb").MongoClient;

let SOUNDCLOUD_URL = process.env.SOUNDCLOUD_URL;
let MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

async function connectToDB() {
  const client = new MongoClient(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true
  });
  await client.connect();
  return client;
}

async function getSoundCloudTracks() {
  let res = await axios.get(SOUNDCLOUD_URL);

  let mapped = res.data.tracks.map(track => ({
    source: "SOUNDCLOUD",
    duration: parseInt(track.duration / 1000, 10),
    created_time: new Date(track.created_at),
    key: track.id,
    name: track.title,
    url: track.uri,
    picture_large: track.artwork_url
  }));

  const client = await connectToDB();
  let incomingIds = mapped.map(it => it.key);

  const trackCollection = client.db("soulector").collection("tracks");
  let existing = await trackCollection
    .find({
      key: {
        $in: incomingIds
      }
    })
    .project({
      key: 1
    })
    .toArray();

  let existingIds = existing.map(doc => doc.key);
  let missingKeys = _.difference(incomingIds, existingIds);
  let missingTracks = missingKeys.map(key => _.find(mapped, { key: key }));

  let insertRes = await trackCollection.insertMany(missingTracks);
  if (insertRes.insertedCount !== missingTracks.length) {
    console.log("inserted count didn't match data count");
  }
  console.log(
    "inserted soulection count",
    insertRes.insertedCount,
    insertRes.result
  );

  return client.close();
}

export async function handler(event, context) {
  try {
    console.log(SOUNDCLOUD_URL, MONGO_CONNECTION_STRING);

    await getSoundCloudTracks();
    console.log("successfully updated tracks");
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: err.message,
        SOUNDCLOUD_URL,
        MONGO_CONNECTION_STRING
      }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
}
