import express, { type Express } from "express";
import errorHandler from "./middlewares/errorHandler.ts";
import notFoundHandler from "./middlewares/notFoundHandler.ts";
import apiV1Router from "./routes/index.ts";

const app: Express = express()

app.use(express.json())

app.use('/api/v1', apiV1Router)

app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000)

const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})

const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

  // 1. Stop the server from accepting new requests
  server.close(() => {
    console.log('HTTP server closed. All ongoing requests finished.');

    // 2. Close database connections (Simulation)
    console.log('Closing database connections...');
    // db.close()

    // 3. Exit the process cleanly
    console.log('Process exiting cleanly.');
    process.exit(0);
  });

  // Optional: Force shutdown if it takes too long
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000); // 10 seconds timeout
};

// Listen for system signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
    gracefulShutdown('SIGTERM') // state may be corrupt, so let your process manager restart
});