import type { Express } from "express";
import express from "express";
import apiV1Router from "./routes/index.ts";

const app: Express = express()

app.get('/', (_, res) => res.send("Welcome to express"))

app.get('/api/v1', apiV1Router)

export default app;