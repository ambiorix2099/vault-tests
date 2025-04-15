import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomUserAgent } from '../lib/utils.js';
import { defaultOptions } from '../k6.config.js';

// Required for k6 configuration setup, we blend in the default options...
export let options = {
  ...defaultOptions,
  stages: [
    { duration: '30s', target: 10 }, // ramp up
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 200 },
    { duration: '30s', target: 400 }, // peak stress
    { duration: '30s', target: 0 }, // ramp down
  ],
};

// Modify these secret locations...
const secrets = ['secret/data/foo', 'secret/data/bar', 'secret/data/baz'];

// Set these in a .env file which will be git ignored...
const vaultAddr = __ENV.VAULT_ADDR;
const vaultToken = __ENV.VAULT_TOKEN;

// The k6 test scenario, which each virtual user will run concurrently...
// noinspection JSUnusedGlobalSymbols
export default function () {
  for (const path of secrets) {
    const res = http.get(`${vaultAddr}/v1/${path}`, {
      headers: {
        'X-Vault-Token': vaultToken,
        'User-Agent': randomUserAgent(),
      },
    });

    check(res, {
      [`GET ${path} status is 200`]: (r) => r.status === 200,
      [`GET ${path} has data`]: (r) => !!r.json('data.data'),
    });

    sleep(1); // simulate real user pacing
  }
}
