import {
  xAckAlert,
  xCreateAlertGroup,
  xReadAlertGroup,
} from 'redis-streams/alert';
import { db } from 'db/client';
import { alertMail } from './email';

const ALERT_CONSUMER_GROUP = 'upsite:status';
const ALERT_WORKER_ID = process.env.ALERT_WORKER_ID!;

async function alertWorker() {
  await xCreateAlertGroup(ALERT_CONSUMER_GROUP);

  while (true) {
    const alerts = await xReadAlertGroup(ALERT_CONSUMER_GROUP, ALERT_WORKER_ID);

    for (const alert of alerts) {
      try {
        if (!alert) continue;

        const { website_id, triggered_at } = alert.message;

        const website = await db.website.findUnique({
          where: {
            id: website_id,
          },
          include: {
            user: true,
          },
        });

        if (!website || !website.user.id) {
          continue;
        }

        await alertMail(
          website.user.email,
          website.url,
          triggered_at as string
        );

        await xAckAlert(ALERT_CONSUMER_GROUP, alert.id);
      } catch (err) {
        console.log('Err sending alert. Retrying...');
        await xAckAlert(ALERT_CONSUMER_GROUP, alert.id);
      }
    }
  }
}

alertWorker();
