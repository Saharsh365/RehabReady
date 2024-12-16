const express = require('express')
require('dotenv').config();
const app = express()
const portNumber = 3000

const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = process.env.MongoDB;

const client = new MongoClient(uri);

async function insertApplicant() {
  try {
    const myDB = client.db("rehabReady");
    const myColl = myDB.collection("users");

    const doc = { name: "Saharsh Maloo", injury: "tendonitis" };
    const result = await myColl.insertOne(doc);
    console.log(
    `A document was inserted with the _id: ${result.insertedId}`,
    );
  } finally {
    await client.close();
  }
}
// run().catch(console.dir);

app.set('view engine', 'ejs');
app.set('views', './templates');

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.listen(portNumber, () => {
    console.log(`Try: http://localhost:${portNumber}`);
})