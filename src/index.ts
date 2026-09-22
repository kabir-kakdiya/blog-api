import express, { type Express } from "express";
import errorHandler from "./middlewares/errorHandler.ts";
import notFoundHandler from "./middlewares/notFoundHandler.ts";
import apiV1Router from "./routes/index.ts";

const app: Express = express()

let shuttingDown = false

app.get('/health', (_, res) => {
    if (shuttingDown) return res.status(503).send("shutting down");
    res.status(200).send("ok")
});

app.use(express.json())

app.use('/api/v1', apiV1Router)

app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000)

const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})

function gracefulShutdown(signal: Uppercase<'sigterm' | 'sigint'>) {
    shuttingDown = true;
    console.log(`Received ${signal}. Starting graceful shutdown...`)

    // give the LB time to notice the 503 and stop routing
    setTimeout(() => {
        server.close(() => {
            process.exit(0)
        })
    }, 3000)

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