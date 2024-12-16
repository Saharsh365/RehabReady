const express = require('express')
require('dotenv').config();
const app = express()
const portNumber = 3000

const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = process.env.MongoDB;

const client = new MongoClient(uri);

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

async function insertApplicant(name, injury) {
  try {
    const myDB = client.db("rehabReady");
    const myColl = myDB.collection("users");

    const doc = { name: name, injury: injury };
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

app.get('/insert', (req, res) => {
    res.render('insert.ejs')
})

app.get('/results', (req, res) => {
    res.render('results.ejs')
})

app.post('/insertApplicant', async (req, res) => {
    const { name, injury } = req.body;
    if (!name || !injury) {
      return res.status(400).send("Name and injury fields are required!");
    }
  
    try {
      await insertApplicant(name, injury);
      res.status(200);
    } catch (err) {
      console.error("Error during POST /add-applicant:", err);
      res.status(500);
    }
  });

app.listen(portNumber, () => {
    console.log(`Try: http://localhost:${portNumber}`);
})