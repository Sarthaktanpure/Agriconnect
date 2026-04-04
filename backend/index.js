require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const app = require("./app");
const { PORT, validateEnvironment } = require("./config/env");
const connectDatabase = require("./config/db");
let server;

async function startServer() {
  try {
    validateEnvironment();
    await connectDatabase();
    console.log("Database connected successfully.");

    server = app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Failed to start server.", error);
    process.exit(1);
  }
}

async function shutdown(signal) {
  try {
    console.log(`${signal} received. Shutting down gracefully.`);

    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Graceful shutdown failed.", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection.", error);
  shutdown("unhandledRejection");
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception.", error);
  shutdown("uncaughtException");
});

startServer();
