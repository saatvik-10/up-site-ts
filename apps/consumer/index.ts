import axios from 'axios';
import { createClient } from 'redis';
import { xAck, xReadGroup } from 'redis-streams/client';

const client = createClient();

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

if (!REGION_ID) {
    throw new Error('Region Id is missing');
}

if (!WORKER_ID) {
    throw new Error('Worker Id is missing');
}

async function worker() {
    // while (true) {
        //reading, processing and storing via queue in bulk, acknowledgement to the queue
        const res = xReadGroup(REGION_ID, WORKER_ID)

        xAck(REGION_ID, '0');
    // }
}
