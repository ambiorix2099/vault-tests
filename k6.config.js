export const defaultOptions = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
  },
  noConnectionReuse: false,
  insecureSkipTLSVerify: true,
};
