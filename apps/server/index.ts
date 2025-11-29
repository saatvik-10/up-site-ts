import express from 'express'
import website from "./routes/website"

const app = express();

app.use("/api", website)

app.listen(8080)