import axios from 'axios';
import { xAckBulk, xReadGroup, xCreateGroup, xAddStatus } from 'redis-streams/client';
import { db } from 'db/client';

const CONSUMER_GROUP = 'upsite:websites';
const WORKER_ID = process.env.WORKER_ID!;

if (!WORKER_ID) {
  throw new Error('Worker Id is missing');
}

console.log(
  `Starting consumer with Group: ${CONSUMER_GROUP}, Worker: ${WORKER_ID}`
);

async function worker() {
  await xCreateGroup(CONSUMER_GROUP);

  const region = await db.region.upsert({
    where: {
      name: CONSUMER_GROUP,
    },
    update: {},
    create: {
      name: CONSUMER_GROUP,
    },
  });

  const region_id = region.id;

  while (true) {
    const res = await xReadGroup(CONSUMER_GROUP, WORKER_ID);

    if (!res) continue;

    let promises = res
      .filter(({ message }) => message.id && message.url)
      .map(({ message }) => fetchUpTicks(message.id!, message.url!, region_id));

    await Promise.all(promises);

    xAckBulk(
      CONSUMER_GROUP,
      res.map(({ id }) => id)
    );
  }
}

async function fetchUpTicks(websiteId: string, url: string, region_id: string) {
  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now();

    axios
      .get(url)
      .then(async () => {
        const endTime = Date.now();

        await db.website_tick.create({
          data: {
            response_time_ms: endTime - startTime,
            status: 'Up',
            region_id: region_id,
            website_id: websiteId,
          },
        });

        await xAddStatus(websiteId, 'Up');

        resolve();
      })
      .catch(async () => {
        const endTime = Date.now();

        await db.website_tick.create({
          data: {
            response_time_ms: endTime - startTime,
            status: 'Down',
            region_id: region_id,
            website_id: websiteId,
          },
        });

        await xAddStatus(websiteId, 'Down');

        resolve();
      });
  });
}

worker();
