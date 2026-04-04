const mongoose = require("mongoose");
const { IS_PRODUCTION, MONGO_URI } = require("./env");

mongoose.set("strictQuery", true);

async function connectDatabase() {
  await mongoose.connect(MONGO_URI, {
    autoIndex: !IS_PRODUCTION,
    serverSelectionTimeoutMS: 10000,
  });
}

module.exports = connectDatabase;
