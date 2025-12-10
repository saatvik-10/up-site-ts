import { createClient } from "redis"
import { db } from "db/client"

const client = createClient()

async function producer() {
    let websites: {id: string, url: string}[] = await db.website.findMany()

    try {
        await client.connect()
        console.log("Redis producer connected")

        //@ts-ignore
        const res = await client.xAdd("upsite:websites", "*", websites.map(website => ({
            id: website.id,
            url: website.url
        })))

        console.log(res)
    } catch (err) {
        console.log("Err connecting to redis producer")
    }
}

setInterval(producer, 3 * 60 * 1000)