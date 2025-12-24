import { createClient } from 'redis';
import type { Alert } from './types';

interface AlertMsg {
  id: string;
  message: Record<string, string>;
}

interface RedisStreamResponse {
  name: string;
  messages: AlertMsg[];
}

const ALERTSTREAM = 'upsite:alerts';

const client = await createClient({
  url: process.env.REDIS_URL!,
})
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect();

console.log('Redis client connected');

export async function xAddAlert({
  alert_id,
  website_id,
  user_id,
  alert_type,
  triggered_at,
}: Alert) {
  const key = `alert:sent:${website_id}`;
  const key_exists = await client.exists(key);

  if (!key_exists) {
    return;
  }

  await client.xAdd(ALERTSTREAM, '*', {
    alert_id: alert_id,
    website_id: website_id,
    user_id: user_id,
    alert_type: alert_type,
    triggered_at: triggered_at.toString(),
  });

  await client.setEx(key, 60 * 60, '1');
}

export async function xCreateAlertGroup(consumerGrp: string) {
  try {
    await client.xGroupCreate(ALERTSTREAM, consumerGrp, '0', {
      MKSTREAM: true,
    });
  } catch (err: any) {
    console.log(err);
  }
}

export async function xReadAlertGroup(
  consumerGrp: string,
  workerId: string
): Promise<AlertMsg[]> {
  const res = (await client.xReadGroup(
    consumerGrp,
    workerId,
    {
      key: ALERTSTREAM,
      id: '>',
    },
    {
      COUNT: 5,
    }
  )) as RedisStreamResponse[] | null;

  if (!res || res.length == 0) {
    return [];
  }

  const alerts: AlertMsg[] = res[0]!.messages.map((alert: any) => ({
    id: alert.id,
    message: {
      alert_id: alert.message.alert_id,
      website_id: alert.message.website_id,
      user_id: alert.message.user_id,
      alert_type: alert.message.alert_type,
      triggered_at: alert.message.triggered_at,
    },
  }));

  return alerts;
}

export async function xAckAlert(consumerGrp: string, eventId: string) {
  await client.xAck(ALERTSTREAM, consumerGrp, eventId);
}
