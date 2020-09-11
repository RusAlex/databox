import Debug from 'debug';
import got from 'got';
import { Module, InitContext } from '../module-utils';
import { Context } from '../server';

const debug = Debug('lb-dev:plugins/databox/debug');
const info = Debug('lb-dev:plugins/databox/info');

export default class Plugin implements Module {
  public interval = 1 * 1000;

  private token: string;

  public init({}: InitContext) {
    if (!process.env.DATABOX_TOKEN) {
      throw new Error('no DATABOX_TOKEN provided');
    }
    this.token = process.env.DATABOX_TOKEN;

    return this;
  }

  private apiCall = data => {
    const options: any = {};
    return got.post<{ errors: string[] }>(
      `https://${this.token}:test@push.databox.com`,
      {
        json: { data },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'Accept: application/vnd.databox.v2+json'
        },
        // responseType: 'json',
        timeout: 10 * 1000,
        ...options
      }
    );
  };

  public handler = ({ appState: { metrics } }: Context) => {
    const sourceWithMetric = Object.keys(metrics).find(source => {
      return !!metrics[source][0];
    });

    if (!sourceWithMetric) {
      return Promise.resolve();
    }

    const data = [
      {
        [`$${sourceWithMetric}_${metrics[sourceWithMetric][0].name}`]: `${metrics[sourceWithMetric][0].value}`
      }
    ];

    return this.apiCall(data)
      .then(response => {
        if (response.body.errors) {
          return debug(response.body);
        }

        metrics[sourceWithMetric].shift();
        // remove metric from source array
        info('submitted');
      })
      .catch(e => {
        debug(e, data);
      });
  };
}
