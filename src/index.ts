import express, { type Express } from "express"
import apiV1Router from "./routes/index.ts"

const app: Express = express()

app.use(express.json())

app.use('/api/v1', apiV1Router)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})