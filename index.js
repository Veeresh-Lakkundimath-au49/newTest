// console.log("first console of the index.js on 31 October 2023")

const cron = require('node-cron');

cron.schedule('*/2 * * * * *', async () => {
  console.log('Hello, World!');
//   await firebase_test();
});
