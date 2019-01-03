import * as line from '@line/bot-sdk';
import * as express from 'express';
import { config } from './config';

const client = new line.Client(config);

async function handleText(message, event) {
    client.replyMessage(event.replyToken, {
        type: 'text',
        text: message.text
    });
}

async function handleEvent(event) {
    console.log('handleEvent', event);
    const message = event.message;
    switch (event.type) {
        case 'message':
            switch (message.type) {
                case 'text':
                    await handleText(message, event); break;
                // case 'image':
                //     return handleImage(message, event.replyToken);
                // case 'video':
                //     return handleVideo(message, event.replyToken);
                // case 'audio':
                //     return handleAudio(message, event.replyToken);
                // case 'file':
                //     return handleFile(message, event.replyToken);
                // case 'location':
                //     return handleLocation(message, event.replyToken);
                // case 'sticker':
                //     return handleSticker(message, event.replyToken);
                default:
                    throw new Error(`Unknown message: ${JSON.stringify(message)}`);
            }
            break;
        // case 'follow':
        //     return replyText(event.replyToken, 'Got followed event');

        // case 'unfollow':
        //     return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

        // case 'join':
        //     return replyText(event.replyToken, `Joined ${event.source.type}`);

        // case 'leave':
        //     return console.log(`Left: ${JSON.stringify(event)}`);

        // case 'memberJoined':
        //     return replyText(event.replyToken, `Member Joined ${event.source.type}`);

        // case 'memberLeft':
        //     return replyText(event.replyToken, `Member Left ${event.source.type}`);

        // case 'postback':
        //     let data = event.postback.data;
        //     return replyText(event.replyToken, `Got postback: ${data}`);

        // case 'beacon':
        //     const dm = `${Buffer.from(event.beacon.dm || '', 'hex').toString('utf8')}`;
        //     return replyText(event.replyToken, `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`);

        default:
            throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
}

function handleWebhook(req, res) {
    // req.body.events should be an array of events
    if (!Array.isArray(req.body.events)) {
        res.status(500).end();
    }
    // handle events separately
    Promise.all(req.body.events.map(async (event) => {
        console.log('handleWebhook', event);
        // check verify webhook event
        if (event.source.userId !== 'Udeadbeefdeadbeefdeadbeefdeadbeef') {
            await handleEvent(event);
        }
    }))
        .then(() => {
            res.end();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
}

export const router = express.Router();

router.post('/', handleWebhook);