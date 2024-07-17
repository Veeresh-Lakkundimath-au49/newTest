// console.log("first console of the index.js on 31 October 2023")

const express = require('express');
const cron = require('node-cron');

const app = express();
cron.schedule('*/2 * * * * *', async () => {
  console.log('Hello, World!');
//   await firebase_test();
});


app.get('/',(req,res)=>{
    console.log('Hello, World! from the home route');
    res.send("Server started successfully");
})