import Debug from 'debug';
import got from 'got';
import { Module, InitContext } from '../module-utils';
import { Context } from '../server';

const debug = Debug('lb-dev:plugins/github/debug');
const info = Debug('lb-dev:plugins/github/info');

export default class Plugin implements Module {
  public interval = 10 * 1000;

  private token: string;

  public init({ context: { appState } }: InitContext) {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('no GITHUB_TOKEN provided');
    }
    this.token = process.env.GITHUB_TOKEN;
    appState.metrics.github = [];
    return this;
  }

  public handler = ({ appState }: Context) => {
    return got<{
      resources: { core: { limit: number; used: number; remaining: number } };
    }>(`https://api.github.com/rate_limit`, {
      headers: { Authorization: `token ${this.token}` },
      responseType: 'json',
      timeout: 10 * 1000
    })
      .then(response => {
        if (!response.body.resources) {
          return debug(response.body);
        }
        info('got response');
        ['limit', 'used', 'remaining'].map(x => {
          appState.metrics.github.push({
            name: x,
            value: response.body.resources.core[x]
          });
        });
        info('got values');
      })
      .catch(debug);
  };
}
