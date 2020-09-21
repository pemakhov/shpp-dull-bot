import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import { Logger } from 'tslog';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const log = new Logger();
// import { addLeadingZero, chunkBy } from './utils';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

const defaultKeyboardConfig = {
    keyboard: [[{ text: 'привет' }, { text: 'обед' }]],
    one_time_keyboard: true,
    resize_keyboard: true,
};

// on bot start
/*
{
  message_id: 1,
  from: {
    id: 171102141,
    is_bot: false,
    first_name: 'Roman',
    last_name: 'Shmelev',
    username: 'rshmelev',
    language_code: 'en'
  },
  chat: {
    id: 171102141,
    first_name: 'Roman',
    last_name: 'Shmelev',
    username: 'rshmelev',
    type: 'private'
  },
  date: 1600633120,
  text: '/start',
  entities: [
    {
      offset: 0,
      length: 6,
      type: 'bot_command'
    }
  ]
}
*/
bot.onText(/\/start/, (msg: TelegramBot.Message) => {
    log.info(msg);
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'start text!', {
        reply_markup: {
            // one_time_keyboard: true,
            keyboard: [[{ text: 'dfd' }]],
        },
    });
});

// bot.on()

/*
{
  message_id: 4,
  from: {
    id: 171102141,
    is_bot: false,
    first_name: 'Roman',
    last_name: 'Shmelev',
    username: 'rshmelev',
    language_code: 'en'
  },
  chat: {
    id: 171102141,
    first_name: 'Roman',
    last_name: 'Shmelev',
    username: 'rshmelev',
    type: 'private'
  },
  date: 1600633278,
  text: 'bubu'
}
*/
bot.onText(/.*/, (msg: TelegramBot.Message) => {
    log.info(msg);
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'any text!', {
        reply_markup: {
            // one_time_keyboard: true,
            keyboard: [[{ text: 'Send' }]],
        },
    });
});

const chunkBy = (array: string, chunkLength: number) => {
    const R = [];
    for (let i = 0; i < array.length; i += chunkLength) {
        R.push(array.slice(i, i + chunkLength));
    }
    return R;
};

async function sendChunked(bot: TelegramBot, chatId: string | number, digest: string) {
    const chunked = chunkBy(digest, 4096);
    for (const chunk of chunked) {
        try {
            await bot.sendMessage(chatId, chunk, {
                parse_mode: 'Markdown',
                reply_markup: defaultKeyboardConfig,
            });
        } catch (e) {
            console.log(`ERROR: SENDING to ${chatId} (${e.message})`);
        }
    }
}

async function main() {
    const app = express();
    app.listen(process.env.port || 3000);

    app.use(express.json());
    app.post('/api/send', async (req, res) => {
        await sendChunked(bot, '' + req.query.userId, '' + req.query.message || 'okaay');
        res.send('ok');
    });
}

main();
