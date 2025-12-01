import express from 'express'
import website from "./routes/website"

const app = express();

app.use(express.json());

app.use("/api", website)

app.listen(8080)