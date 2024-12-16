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

async function ensureUniqueIndex() {
    const myDB = client.db("rehabReady");
    const myColl = myDB.collection("users");
    await myColl.createIndex({ name: 1 }, { unique: true });
}
ensureUniqueIndex();

async function insertApplicant(name, injury) {
    try {
        const myDB = client.db("rehabReady");
        const myColl = myDB.collection("users");
        const doc = { name: name, injury: injury };
        const result = await myColl.insertOne(doc);
        console.log(
        `A document was inserted with the _id: ${result.insertedId}`,
        );
    }
    catch (err) {
        if (err.code === 11000) {
            console.error("Duplicate entry detected for name:", name);
            throw new Error("Name already exists!");
        } else {
            console.error("Error inserting document:", err);
            throw err;
        }
    }
}

async function getInjuries(name) {
    const myDB = client.db("rehabReady");
    const myColl = myDB.collection("users");
    const cursor = await myColl.find(name);
    return cursor;
}

async function removeAll() {
    let result;
    try {
        await client.connect();
        console.log("***** Clearing Collection *****");
        const myDB = client.db("rehabReady");
        const myColl = myDB.collection("users");
        result = await myColl.deleteMany({});
        console.log(`Deleted documents ${result.deletedCount}`);
    } catch (e) {
        console.error(e);
    }
}


app.set('view engine', 'ejs');
app.set('views', './templates');
app.use(express.static('styles'));

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
      res.status(200).redirect('/results');
    } catch (err) {
      console.error("Error during POST /insertApplicant:", err);
      res.status(500).send("Error during POST /insertApplicant:");
    }
});

app.post('/showResults', async (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send("Name is required!");
    }
  
    let dbResult = await getInjuries();
    dbResult = await dbResult.toArray();
    const injuries = dbResult[0].injury;
    let images = "";
    if (injuries.includes('Ankle Sprain')) {
        images += "<h1>BANG!!!</h1><br></br>";
    }
    res.render('processResults.ejs', {images});
});

app.post('/delete', async (req, res) => {
    await removeAll();
});

app.listen(portNumber, () => {
    console.log(`Try: http://localhost:${portNumber}`);
})