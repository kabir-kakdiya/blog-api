import { Consumer } from 'sqs-consumer';

import { SQS } from './constants.ts';
import db from '../db/db.ts';

export interface S3EventRecord {
    eventVersion: string;
    eventSource: string;
    awsRegion: string;
    eventTime: string;
    eventName: string;
    userIdentity: { principalId: string };
    requestParameters: { sourceIPAddress: string };
    responseElements: Record<string, string>;
    s3: {
        s3SchemaVersion: string;
        configurationId: string;
        bucket: {
            name: string;
            ownerIdentity: { principalId: string };
            arn: string;
        };
        object: {
            key: string;
            size?: number;
            eTag?: string;
            versionId?: string;
            sequencer: string;
        };
    };
}

interface S3TestEvent {
    Event: 's3:TestEvent';
    Bucket: string;
    Time: string;
}

interface S3NotificationBody {
    Records: S3EventRecord[];
}


interface S3TestEvent {
    Event: 's3:TestEvent';
    Bucket: string;
    Time: string;
}

interface S3NotificationBody {
    Records: S3EventRecord[];
}

type SqsMessageBody = S3TestEvent | S3NotificationBody;

function isTestEvent(body: SqsMessageBody): body is S3TestEvent {
    return 'Event' in body && body.Event === 's3:TestEvent';
}

const consumer = Consumer.create({
    queueUrl: process.env.SQS_QUEUE_URL!,
    sqs: SQS,
    batchSize: 10,
    visibilityTimeout: 30,
    handleMessageBatch: async (messages) => {
        const successful = [];

        for (const message of messages) {
            try {
                if (!message.Body) {
                    successful.push(message);
                    continue;
                }

                const body = JSON.parse(message.Body) as SqsMessageBody;

                if (isTestEvent(body)) {
                    successful.push(message);
                    continue;
                }

                for (const record of body.Records ?? []) {
                    await handleS3Record(record); // record: S3EventRecord, fully typed
                }

                successful.push(message);
            } catch (err) {
                console.error('Failed to process message', message.MessageId, err);
            }
        }

        return successful;
    },
});

async function handleS3Record(record: S3EventRecord) {
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    const eventName = record.eventName;

    if (eventName.startsWith('ObjectCreated:')) {
        await db
            .updateTable('media')
            .set({ fileSize: record.s3.object.size, status: 'active' })
            .where('key', '=', key)
            .execute();
    } else if (eventName.startsWith('ObjectRemoved:')) {
        await db
            .updateTable('media')
            .set({ status: 'deleted' })
            .where('key', '=', key)
            .execute();
    }
}