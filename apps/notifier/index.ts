import { xAddAlert } from 'redis-streams/alert';
import { xGetRecentStatus } from 'redis-streams/client';
import { db } from 'db/client';
import crypto from 'crypto';

async function notifier() {
  const websites = await db.website.findMany({
    include: {
      user: true,
    },
  });

  for (const website of websites) {
    try {
      const status = await xGetRecentStatus(website.id);

      if (!status || status.length === 0) continue;

      let cnt = 0;

      for (const st of status) {
        if (st.message.status === 'Down') {
          cnt++;
        } else {
          break;
        }
      }

      if (cnt > 3) {
        await xAddAlert({
          alert_id: crypto.randomUUID(),
          website_id: website.id,
          user_id: website.user.id,
          alert_type: 'Down',
          triggered_at: new Date(),
        });
      }
    } catch (err) {
      console.log(`Error for ${website.url}`, err);
    }
  }
}

notifier();

setInterval(notifier, 60 * 1000);
