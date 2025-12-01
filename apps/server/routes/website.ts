import { Router } from "express";
import { db } from "db/client"

const route = Router()

route.post("/website", async (req, res) => {
    if (!req.body.url) {
        res.status(411).json("Wrong inputs were found")
        return;
    }

    const website = await db.website.create({
        data: {
            url: req.body.url
        }
    })

    res.json({
        id: website.id
    })
})

// route.get("/status/:websiteId")

export default route