import Debug from 'debug';
import got from 'got';
import { Context } from '../server';
import { InitContext, Module } from '../module-utils';

const debug = Debug('lb-dev:plugins/localbitcoins/debug');
const info = Debug('lb-dev:plugins/localbitcoins/info');

export default class Plugin implements Module {
  public interval = 10 * 1000;

  public init({ context: { appState } }: InitContext) {
    appState.metrics.local = [];

    return this;
  }

  public handler = ({ appState }: Context) => {
    return got<{
      data: { ad_count: number; ad_list: { data: { temp_price: string } }[] };
    }>(
      `https://localbitcoins.net/sell-bitcoins-online/eur/sepa-eu-bank-transfer/.json`,
      { responseType: 'json', timeout: 10 * 1000 }
    )
      .then(response => {
        if (!response.body.data) {
          return debug(response.body);
        }
        info('got response');
        if (response.body.data.ad_count === 0) {
          return;
        }
        appState.metrics.local.push(
          {
            name: 'ad_count',
            value: response.body.data.ad_count
          },
          {
            name: 'min_price',
            value: parseFloat(
              response.body.data.ad_list.sort(
                (a, b) =>
                  parseFloat(a.data.temp_price) - parseFloat(b.data.temp_price)
              )[0].data.temp_price
            )
          },
          {
            name: 'max_price',
            value: parseFloat(
              response.body.data.ad_list.sort(
                (b, a) =>
                  parseFloat(a.data.temp_price) - parseFloat(b.data.temp_price)
              )[0].data.temp_price
            )
          }
        );
        info('got values');
      })
      .catch(debug);
  };
}
