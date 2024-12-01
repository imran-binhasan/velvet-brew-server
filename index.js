const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json())
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tlbvp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const database = client.db('Coffeshop')
const coffeList = database.collection('coffeList')

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    
app.get('/coffees', async(req, res) => {
  const data = await coffeList.find().toArray()
    res.send(data);
})

app.get('/coffee/:id', async (req, res) => {
  const id = req.params.id;
  const query = await coffeList.findOne({_id: new ObjectId(id)});
  res.send(query)
})

app.get('/updateCoffee/:id', async (req, res) => {
  const id = req.params.id
  const data = await coffeList.find({_id: new ObjectId(id)})
  console.log(data)
  res.send(data)
})

app.post('/coffees',async(req, res) => {
  const data = req.body;
  const result =await coffeList.insertOne(data);
  res.send(result);
  console.log('Updated',data)
  console.log(result);
})

app.delete('/coffees/:id',async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await coffeList.deleteOne(query)
  res.send(result);
  console.log(result);
})

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`coffe server is running on port : ${port}`)
})