const cron = require("node-cron");
const cors = require("cors");
const NodeCache = require("node-cache");
const listings = require("../data/list");
const bodyParser = require("body-parser");
const cache = new NodeCache({ stdTTL: 0, checkperiod: 0 });
const fs = require("fs");

const cacheFile = "../cache/cache.json";

let counter = 0;
const express = require("express");
const app = express();

const corsOptions = {
  origin: "https://new-test-express.vercel.app/", // Replace with your Vercel app URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

// Use cors middleware with options
app.use(bodyParser.json());
app.use(cors(corsOptions));

// Load cache from the file if it exists and contains valid JSON
const loadCacheFromFile = () => {
  // if (fs.existsSync(cacheFile)) {
  //   try {
  //     const cacheData = JSON.parse(fs.readFileSync(cacheFile, "utf-8")); // Parse JSON
  //     if (typeof cacheData === 'object' && cacheData !== null) {
  //       const data = cache.mset(cacheData); // Set the loaded data into cache
  //       console.log("cache.mset data: ",data);
  //       // console.log("cache obj: ",cache);
  //       const cache_get = cache.mget(cache.keys());
  //       console.log("cache_get: ",cache_get);
  //       console.log("Cache loaded from file:", cacheData);
  //     }
  //   } catch (error) {
  //     console.error("Failed to load cache from file:", error);
  //     // Optionally delete the corrupted file if it can't be parsed
  //     fs.unlinkSync(cacheFile);
  //     console.log("Corrupted cache file deleted.");
  //   }
  // }



  if (fs.existsSync(cacheFile)) {
    try {
      const cacheData = JSON.parse(fs.readFileSync(cacheFile, "utf-8")); // Parse JSON
      // Ensure cacheData is an object and is not empty
      if (typeof cacheData === "object" && cacheData !== null) {
        // Convert cacheData to the format expected by mset
        const formattedCacheData = Object.entries(cacheData).map(
          ([key, val]) => ({ key, val })
        );
        cache.mset(formattedCacheData); // Set the formatted data into cache
        console.log("Cache loaded from file:", cacheData);
        const cache_get = cache.mget(cache.keys());
        console.log("cache_get: ", cache_get);
      }
    } catch (error) {
      console.error("Failed to load cache from file:", error);
      // Handle the error (e.g., delete the corrupted file or initialize cache)
      fs.unlinkSync(cacheFile); // Optionally delete the corrupted file
      console.log("Corrupted cache file deleted.");
    }
  }
};



// Save cache data to file before server stops
const saveCacheToFile = () => {
  const cacheData = cache.keys().reduce((obj, key) => {
    obj[key] = cache.get(key);
    return obj;
  }, {});

  // Only write to the file if there is cache data
  if (Object.keys(cacheData).length > 0) {
    fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2), "utf-8");
    console.log("Cache saved to disk.");
  } else {
    console.log("No cache data to save.");
  }
};

// Load cache when server starts
loadCacheFromFile();

process.on("exit", saveCacheToFile);
process.on("SIGINT", () => {
  saveCacheToFile();
  process.exit();
});

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

// API Endpoints
app.get("/", (req, res) => {
  console.log("counter: ", counter);
  res.send("Express on Vercel");
});

app.get("/counter", (req, res) => {
  console.log("counter: ", counter);
  res.send(counter.toString()); // Ensure the response is a string
});

app.post("/user", (req, res) => {
  const { profile_uid } = req.body;
  listings.forEach((list) => {
    if (list.profile_uid === profile_uid) {
      setCache(`${profile_uid}`, list);
    }
  });
  res.status(200).send("Data cached successfully!");
});

app.get("/list", (req, res) => {
  const profile_uid = req.query.profile_uid; // Fetch the 'profile_uid' from query
  console.log("req.query: ", req.query);
  const data = getCache(`${profile_uid}`);
  res.status(200).send({ data: data });
});

// Start the server
app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app; // Export the app for Vercel deployment
