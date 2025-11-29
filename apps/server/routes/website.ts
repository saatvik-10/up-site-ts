import { Router } from "express";

const route = Router()

route.post("/website")
route.get("/status/:websiteId")

export default route