const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

const uri = "mongodb://samuelomohan_db_user:MC2znBugNEr4qM0U@jumpai.frzsths.mongodb.net/?appName=JumpAI";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  ssl: false,
});

const app = express();

client.connect().then(() => console.log("connected")).catch(e => console.log(e));
app.use(cors({ credentials: true, origin: (_, cb) => cb(null, true)}))
app.use(express.json())

app.get("/indexes/:date", async (req, res) => {
  const reading = await fetch(`https://api.carbonintensity.org.uk/intensity/${req.params.date}`)
  await client.db("jumpai").collection("indexes").insertOne({ reading: reading, date: new Date() })
  res.json(reading)
});

app.get("/indexes", async (_, res) => {
  console.log('indexes')
  const readings = await client.db("jumpai").collection("indexes").find().toArray();
  console.log("indexes");
  res.json(readings);
});

app.listen(5000, () => console.log("Listening on 5000"));