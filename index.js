const express = require ('express');
const cors =require('cors');
const app=express();
require('dotenv').config()
const port =process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rin8xcl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
const mediaCollection=client.db("Uploady_SocialMedia").collection("media");
const CommentCollection = client.db("Uploady_SocialMedia").collection("comment");
const usersCollection = client.db("Uploady_SocialMedia").collection("users");


app.get('/media',async(req,res)=>{
  const result= await mediaCollection.find().toArray();
  res.send(result);
})

 app.post('/media',async(req,res)=>{
  const addMedia=req.body;
  const result=await mediaCollection.insertOne(addMedia);
  res.send(result);
 })

 app.get('/comment',async(req,res)=>{
  const result= await CommentCollection.find().toArray();
  res.send(result);
})
 app.post('/comment',async(req,res)=>{
  const addComment=req.body;
  const result=await CommentCollection.insertOne(addComment);
  res.send(result);
 });

 // get id ways media 
 app.get('/media/:id',async(req,res)=>{
  const id=req.params.id.toString();
  console.log(id)
  const query ={_id: new ObjectId(id)} ;
  const result=await mediaCollection.findOne(query);
  res.send(result)
 })


 ///users
 app.get('/users', async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
});

app.post('/users', async (req, res) => {

  const user = req.body;
  console.log(user);
  const query = { email: user.email };
  const existingUser = await usersCollection.findOne(query);
  console.log('existing User', existingUser);
  if (existingUser) {
    return res.send({ message: 'User already exists' });
  }
  const result = await usersCollection.insertOne(user);
  res.send(result);


});

app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
        name: body.name,
      address: body.address,
      university: body.university,
      image: body.image,
    },
  };
  const result = await usersCollection.updateOne(filter, updateDoc);
  console.log(result)
  res.send(result);
});
// update like;;
app.put('/media/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
        like: body.like,
    },
  };
  const result = await mediaCollection.updateOne(filter, updateDoc); // Update mediaCollection, not usersCollection
  console.log(result)
  res.send(result);
});



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('user mangement runnign')
});
app.listen(port,()=>{
    console.log(`server is runnig on port :${port}`)
})