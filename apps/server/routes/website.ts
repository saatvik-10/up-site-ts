import { Router } from "express";
import { db } from "db/client"

const route = Router()

route.post("/website", async (req, res) => {
    const website = await db.website.create({
        data: {
            url: req.body.url
        }
    })

    res.json({
        id: website.id
    })
})

route.get("/status/:websiteId")

export default route