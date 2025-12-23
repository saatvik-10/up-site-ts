import { createClient } from 'redis';
import { chunkArray } from './utils/lib';

interface WebsiteProps {
    id: string;
    url: string;
}

interface Msg {
    id: string;
    message: Record<string, string>;
}

interface RedisStreamResponse {
    name: string;
    messages: Msg[]
}

const STREAM = 'upsite:websites';

const client = await createClient({
    url: process.env.REDIS_URL!
})
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect();

console.log('Redis client connected');

export async function xAddBulk(websites: WebsiteProps[], batchSize = 100) {
    try {
        const validWebsites = websites.filter(
            (website) => website.id && website.url
        );
        if (validWebsites.length == 0) return;

        console.log('Valid websites to add:', validWebsites.length);

        const chunks = chunkArray(validWebsites, batchSize);

        for (const chunk of chunks) {
            try {
                const pipeline = client.multi();

                for (const website of chunk) {
                    pipeline.xAdd(STREAM, '*', {
                        id: website.id,
                        url: website.url,
                    });
                }
                await pipeline.exec();
            } catch (err) {
                console.error('Batch failed:', err);
            }
        }
    } catch (err) {
        console.log('Err connecting redis bulk streaming');
    }
}


export async function xCreateGroup(consumerGrp: string) {
    try {
        await client.xGroupCreate(STREAM, consumerGrp, '0', {
            MKSTREAM: true,
        });
        console.log(`Consumer group '${consumerGrp}' created successfully`);
    } catch (err: any) {
        console.error('Error creating consumer group:', err);
    }
}

export async function xReadGroup(consumerGrp: string, workerId: string): Promise<Msg[]> {
    const res = await client.xReadGroup(
        consumerGrp,
        workerId,
        {
            key: STREAM,
            id: '>',
        },
        {
            COUNT: 5,
        }
    ) as RedisStreamResponse[] | null

    if (!res || res.length === 0) {
        console.log('No messages in stream');
        return [];
    }

    const msgs: Msg[] = res[0]!.messages.map((msg: any) => ({
        id: msg.id,
        message: {
            id: msg.message.id,
            url: msg.message.url,
        },
    }));

    console.log('Parsed msgs:', msgs);

    return msgs;
}

export async function xAckBulk(
    consumerGrp: string,
    eventIds: string[],
    batchSize = 200
) {
    const chunks = chunkArray(eventIds, batchSize);

    for (const chunk of chunks) {
        await client.xAck(STREAM, consumerGrp, chunk);
    }
}