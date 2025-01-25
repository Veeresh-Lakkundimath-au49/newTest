
const cron = require('node-cron');
const cors = require('cors');
const NodeCache = require("node-cache");
const listings = require('../data/list');
const bodyParser = require('body-parser');
const cache = new NodeCache({ stdTTL: 0, checkperiod: 0 });

let counter = 0;
const express = require("express");
const app = express();

const corsOptions = {
  origin: 'https://new-test-express.vercel.app/', // Replace with your Vercel app URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

// Use cors middleware with options
app.use(bodyParser.json());
app.use(cors(corsOptions));


// Function to set a value in the cache
const setCache = (key, value) => {
  const success = cache.set(key, value);
  if (success) {
    console.log(`Key "${key}" set successfully in the cache.`);
  } else {
    console.log(`Failed to set key "${key}" in the cache.`);
  }
};

// Function to get a value from the cache
const getCache = (key) => {
  const value = cache.get(key);
  if (value === undefined) {
    console.log(`Key "${key}" not found in the cache.`);
    return null;
  } else {
    console.log(`Key "${key}" found in the cache:`, value);
    return value;
  }
};

// Function to delete a key from the cache
const deleteCache = (key) => {
  const deleted = cache.del(key);
  if (deleted > 0) {
    console.log(`Key "${key}" deleted from the cache.`);
  } else {
    console.log(`Key "${key}" not found in the cache.`);
  }
};


// Example usage
// setCache("user1", { name: "Alice", age: 28 });
// getCache("user1");

// Test deletion
// deleteCache("user1");
// getCache("user1");


app.get("/", (req, res) => {
 console.log("counter: ",counter);
  res.send("Express on Vercel")
});

app.get("/counter",(req,res)=>{
  console.log("counter: ",counter);
  res.send(counter)
})

// app.get('/list',(req,res)=>{
// console.log("listings: ",listings);
// res.send(listings);
// });

app.post('/user',(req,res)=>{
  const { profile_uid } = req.body;
  listings.forEach((list)=>{
    if(list.profile_uid==profile_uid){
      setCache(`${profile_uid}`,list);
    }
  });
  res.status(200).send("data cached successfully!");
});

app.get('/list',(req,res)=>{
  const profile_uid = req.query.profile_uid; // Fetch the 'id' from params
  console.log("req.query : ",req.query);
  const data = getCache(`${profile_uid}`);
  res.status(200).send({data:data});
})

app.listen(3000, () => console.log("Server ready on port 3000."));

// module.exports = app;

module.exports = app; // Export the app for Vercel deployment
