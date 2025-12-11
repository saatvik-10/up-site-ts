import { db } from "db/client"
import { xAddBulk } from "redis-streams/client"

interface WebsiteProps {
    id: string;
    url: string;
}

async function producer() {
    let websites: WebsiteProps[] = await db.website.findMany({
        select: {
            id: true,
            url: true
        }
    })

    try {
        const res = await xAddBulk(websites.map(website => ({
            id: website.id,
            url: website.url
        })))

    } catch (err) {
        console.log("Err connecting to redis producer")
    }
}
setInterval(producer, 3 * 60 * 1000)

producer()