import axios from 'axios';
import { xAck, xReadGroup } from 'redis-streams/client';
import { db } from "db/client"

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

if (!REGION_ID) {
    throw new Error('Region Id is missing');
}

if (!WORKER_ID) {
    throw new Error('Worker Id is missing');
}

async function worker() {
    //reading, processing and storing via queue in bulk, acknowledgement to the queue
    const res = await xReadGroup(REGION_ID, WORKER_ID)

    let promises = res
        .filter(({ message }) => message.id && message.url)
        .map(({ message }) => fetchUpTicks(message.id!, message.url!))

    await Promise.all(promises)

    xAck(REGION_ID, '0');
}

worker()

async function fetchUpTicks(websiteId: string, url: string) {
    return new Promise<void>((resolve, reject) => {

        const startTime = Date.now()

        axios.get(url).then(async () => {
            const endTime = Date.now()

            await db.website_tick.create({
                data: {
                    response_time_ms: endTime - startTime,
                    status: "Up",
                    region_id: REGION_ID,
                    website_id: websiteId
                }
            })
            resolve()
        }).catch(async () => {
            const endTime = Date.now()

            await db.website_tick.create({
                data: {
                    response_time_ms: endTime - startTime,
                    status: "Down",
                    region_id: REGION_ID,
                    website_id: websiteId
                }
            })
            resolve()
        })
    })
}