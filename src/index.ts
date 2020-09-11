import Debug from 'debug';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import server from './server';

/**
 * Startup file isf responsible for initializing modules from
 *  ./modules folder and run module handler(s) by using intervals
 * intervals can be configured in module otherwise default intervals
 * used.
 *
 * Application context (server.context here) is passed to every handler.
 *
 * Module may have mod.handler property as function or
 * mod.handlers property as array of objects where handler options
 * defined.
 *
 * race conditions in handler execution avoided by design.
 */
const debug = new Debug('sms');

server.context.appState = {
  metrics: {}
};

const handlers = [] as {
  fun: () => void;
  semaphore: number;
  context: any;
  interval: number;
  enabled: boolean;
}[];

fs.readdirSync(`${__dirname}/modules/`).map(x => {
  const y = require(`./modules/${x}`).default;
  const mod = new y(x).init({ context: server.context, server });
  if (!x) return;
  if (mod.handler) {
    handlers.push({
      fun: mod.handler,
      semaphore: 0,
      context: server.context,
      interval: mod.interval || 30 * 1000,
      enabled: true
    });
  }

  if (mod.handlers) {
    mod.handlers.forEach(handler =>
      handlers.push({
        fun: handler.fun,
        semaphore: 0,
        context: server.context,
        interval: handler.interval || mod.interval || 30 * 1000,
        enabled: true
      })
    );
  }
});

for (const x of handlers) {
  if (!x.enabled) {
    continue;
  }
  setInterval(async () => {
    if (x.semaphore === 1) {
      return;
    }
    x.semaphore = 1;

    try {
      // @ts-ignore
      await x.fun(x.context);
    } catch (e) {
      debug(e);
      return (x.semaphore = 0);
    }
    return (x.semaphore = 0);
  }, x.interval);
}

server.listen(3001);
