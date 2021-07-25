import { App } from '@slack/bolt';
import cron, { Job } from 'node-schedule';
import config from 'config';
import axios from 'axios';
import logger from '@/models/logger';

const log = logger('SLACK');

const port = 3000;

const monitors: Record<string, Job> = {};

const schedule = '0 * * * * *';

export default async function init(): Promise<void> {
    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        socketMode: true,
        appToken: process.env.SLACK_APP_TOKEN,
    });

    app.command('/monitor', async function ({ command, ack, say }) {
        log.info('Incoming command', command);

        try {
            const { text } = command;
            const task = monitors[text];

            await ack();

            if (task) {
                task.cancel();

                delete monitors[text];

                log.info(`Monitor for ${text} disabled`);
                await say(`Monitor for ${text} disabled`);
                return;
            }

            if (!config.has(text)) {
                log.info(`Monitor for ${text} not available`);
                await say(`Monitor for ${text} not available`);
                return;
            }

            monitors[text] = cron.scheduleJob(schedule, async function (time) {
                try {
                    const { data } = await axios.get(config.get(text) as string);

                    log.info(`PASS\t[${text}]`, data);
                } catch (e) {
                    log.error(`FAIL\t[${text}]`, e);
                    await say(`${time.toString()}\t${text} failed health check\t${e.message}`);
                }
            });

            log.info(`Monitor for ${text} enabled`);
            await say(`Monitor for ${text} enabled`);
        } catch (e) {
            log.error(e.message);
        }
    });

    await app.start(port);

    log.info(`Listening on port ${port}`);
}
