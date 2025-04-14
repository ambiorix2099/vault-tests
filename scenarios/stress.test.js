import http from 'k6/http';
import {check, sleep} from 'k6';
import {randomUserAgent} from '../lib/utils.js';
import {defaultOptions} from '../k6.config.js';

// These variable is required for k6 configuration setup...
export let options = defaultOptions;

// Modify these secret locations...
const secrets = [
    'secret/data/foo',
    'secret/data/bar',
    'secret/data/baz',
];

const vaultAddr = __ENV.VAULT_ADDR
const vaultToken = __ENV.VAULT_TOKEN

// This is the k6 test scenario, which each virtual user will run concurrently...
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
