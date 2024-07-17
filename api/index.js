
// const express = require('express');
const cron = require('node-cron');

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

const express = require("express");
const app = express();
cron.schedule('*/2 * * * * *', async () => {
    console.log('Hello, World cron job!');
    try {
        let info = await fetch("https://new-test-express.vercel.app/");
        const data = await info.text();
        console.log("data: ",data);
    } catch (error) {
        console.log("error in cron: ",error);
    }
  //   await firebase_test();
  });



console.log("Hello world from new project");
app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;

module.exports = app; // Export the app for Vercel deployment
