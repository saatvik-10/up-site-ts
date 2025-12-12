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

route.get("/status/:websiteId", authMiddleware, async (req, res) => {
    const website = await db.website.findFirst({
        where: {
            id: req.params.websiteId,
            user_id: req.userId
        },
        include: {
            ticks: {
                orderBy: [{
                    created_at: 'desc'
                }],
                take: 10,
            },
        }
    })

    if (!website) {
        res.status(404).send("Website not found!")
        return;
    }

    res.json({
        website: {
            id: website.id,
            url: website.url,
            user_id: website.user_id
        }
    })
})

export default route