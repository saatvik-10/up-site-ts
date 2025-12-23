import { createClient } from 'redis';
import type { Alert } from './types';

const ALERTSTREAM = 'upsite:alerts';

const client = await createClient({
  url: process.env.REDIS_URL!,
})
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect();

console.log('Redis client connected');

export async function xAdd({
  alert_id,
  website_id,
  user_id,
  alert_type,
  triggered_at,
}: Alert) {
  await client.xAdd(ALERTSTREAM, '*', {
    alert_id: alert_id,
    website_id: website_id,
    user_id: user_id,
    alert_type: alert_type,
    triggered_at: triggered_at.toString(),
  });
}
