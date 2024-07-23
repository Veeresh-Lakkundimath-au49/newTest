
// const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
// const app = express();
// cron.schedule('*/2 * * * * *', async () => {
//   console.log('Hello, World!');
// //   await firebase_test();
// });

// console.log("first console of the index.js on 31 October 2023")


// app.get('/',(req,res)=>{
//     console.log('Hello, World! from the home route');
//     res.send("Server started successfully");
// })
let counter = 0;
const express = require("express");
const app = express();

const corsOptions = {
  origin: 'https://new-test-express.vercel.app/', // Replace with your Vercel app URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

// Use cors middleware with options
app.use(cors(corsOptions));


cron.schedule('*/10 * * * * *', async () => {
    // console.log('Hello, World cron job!');
    try {
      // https://new-test-express.vercel.app/
        let info = await fetch("https://new-test-express.vercel.app/");
        if (!info.ok) {
          throw new Error(`HTTP error! Status: ${info.status}`);
      }
        const data = await info.text();
        console.log("data: ",data);
        counter += 1;
    } catch (error) {
        console.log("error in cron: ",error);
    }
  //   await firebase_test();
  });



// console.log("Hello world from new project");
app.get("/", (req, res) => {
 console.log("counter: ",counter);
  res.send("Express on Vercel")


});

app.get("/counter",(req,res)=>{
  console.log("counter: ",counter);
  res.send(counter)
})
app.listen(3000, () => console.log("Server ready on port 3000."));

// module.exports = app;

module.exports = app; // Export the app for Vercel deployment
