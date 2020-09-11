import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import Router from 'koa-router';

interface Metric {
  name: string;
  value: any;
}
interface AppState {
  metrics: { [key: string]: Metric[] };
}

export interface Context {
  appState: AppState;
}

const app = new koa<{}, Context>();

app.use(bodyParser());

const router = new Router<{}, Context>();

app.use(router.routes());
app.use(serve('public'));

export default app;
