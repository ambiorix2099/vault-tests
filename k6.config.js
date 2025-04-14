export const defaultOptions = {
    vus: 10, // Adjust the virtual users
    duration: '30s', // There are other types of tests, besides duration based
    vaultAddr: 'http://127.0.0.1:5000',
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'],
    },
};
