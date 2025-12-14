import { Router } from "express";
import { db } from "db/client"
import { authProxy } from "../proxy";

const route = Router()

route.post("/website", authProxy, async (req, res) => {
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

route.get("/status/:websiteId", authProxy, async (req, res) => {
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

route.get("websites", authProxy, async (req, res) => {
    const websites = await db.website.findMany({
        where: {
            user_id: req.userId
        }
    })

    if (!websites) {
        res.status(404).send("No Websits found for the user!")
        return;
    }

    res.json(websites)
})

export default route