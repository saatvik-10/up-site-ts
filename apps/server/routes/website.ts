import { Router } from "express";
import { db } from "db/client"
import { authMiddleware } from "../proxy";

const route = Router()

route.post("/website", authMiddleware, async (req, res) => {
    if (!req.body.url) {
        res.status(411).json("Wrong inputs were found")
        return;
    }

    const website = await db.website.create({
        data: {
            user_id: req.userId!,
            url: req.body.url
        }
    })

    res.json({
        id: website.id
    })
})

route.get("/status/:websiteId", authMiddleware, (req, res) => {
    const website = db.website.findFirst({
        where: {
            id: req.params.websiteId,
            user_id: req.userId
        },
        include: {
            ticks: {
                orderBy: [{
                    createdAt: 'desc'
                }],
                take: 1,
            },
        }
    })

    if (!website) {
        res.status(404).send("Website not found!")
        return;
    }

    res.json({
        website
    })
})

export default route