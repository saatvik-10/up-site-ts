import { createClient } from 'redis';
import { chunkArray } from './utils/lib';

interface WebsiteProps {
  id: string;
  url: string;
}

const client = createClient();

// export async function xAdd({ id, url }: WebsiteProps) {
//   await client.xAdd('upsite:websites', '*', {
//     id: id,
//     url: url,
//   });
// }

export async function xAddBulk(websites: WebsiteProps[], batchSize = 100) {
  try {
    await client.connect();
    console.log('Redis bulk streaming connected');

    const validWebsites = websites.filter(
      (website) => website.id && website.url
    );
    if (validWebsites.length == 0) return;

    const chunks = chunkArray(validWebsites, batchSize);

    for (const chunk of chunks) {
      const pipeline = client.multi();

      for (const website of chunk) {
        pipeline.xAdd('upsite:websites', '*', {
          id: website.id,
          url: website.url,
        });
      }
      await pipeline.exec();
    }
  } catch (err) {
    console.log('Err connecting redis bulk streaming');
  }
}
