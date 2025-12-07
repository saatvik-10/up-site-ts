import express from 'express'
import website from "./routes/website"
import user from "./routes/user"
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());

app.use(cookieParser())

app.use("/api", website)
app.use("/api", user)

app.listen(8080)