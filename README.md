# 🔐 k6 Vault Secret Read Tests

This project uses [k6](https://k6.io) to run performance and integration tests against [HashiCorp Vault](https://www.vaultproject.io/) using its HTTP API. Tests focus on reading secrets from various Vault paths to assess performance, policy correctness, and reliability under load.

---

## 📁 Project Structure

```
.
├── Makefile                 # Convenient targets for running tests
├── jsconfig.json            # JS type support for k6 in editors
├── k6.config.js             # Shared config for common k6 options
├── lib/                     # Shared utilities (e.g. token helpers, logging)
├── scenarios/               # Test definitions (smoke, load, stress, etc.)
├── reports/                 # Output folder for test results (JSON)
├── .env                     # Environment variable file (not committed)
├── run-k6.sh                # Shell wrapper to load .env before running k6
└── README.md
```

---

## 🚀 Prerequisites

- [Go](https://golang.org/dl/) and `go install go.k6.io/k6@latest`
- Access to a Vault instance (with proper token and permissions)
- Environment variable: `VAULT_TOKEN`

---

## 🛠 Configuration with `.env`

Create a `.env` file in the project root:

```dotenv
VAULT_TOKEN=s.xxxxxxxx
VAULT_ADDR=https://vault.example.com
```

The included `run-k6.sh` script will automatically load these values before executing any k6 test. It uses the pattern `export $(grep -v '^#' .env | xargs)` to load variables from the `.env` file.

Make it executable:

```bash
chmod +x run-k6.sh
```

Then run tests like:

```bash
./run-k6.sh run scenarios/smoke.test.js
```

The `Makefile` uses this script to simplify test execution.

---

## 📦 Available Tests

Each test targets a different level of load simulation. The stress test uses a k6 `stages` configuration to ramp up virtual users over time and push the system toward its limits. This approach helps identify the point of failure or performance degradation. For example:

```js
stages: [
  { duration: '30s', target: 10 }, // ramp up
  { duration: '30s', target: 50 },
  { duration: '30s', target: 100 },
  { duration: '1m', target: 200 },
  { duration: '30s', target: 400 }, // peak stress
  { duration: '30s', target: 0 }, // ramp down
];
```

| Target                   | Description                                |
| ------------------------ | ------------------------------------------ |
| `make smoke-tests`       | Quick sanity check for secret endpoints    |
| `make integration-tests` | Verifies secrets under expected policies   |
| `make load-tests`        | Simulates moderate concurrent reads        |
| `make stress-tests`      | Pushes Vault read throughput to its limits |
| `make clean`             | Deletes test result output files           |

The `Makefile` uses a `run-k6.sh` wrapper to ensure `.env` values are loaded before executing each test scenario.

You can run all tests:

```bash
makebash
make
```

Or run a specific one:

```bash
make load-tests
```

---

## 📄 Output

Test result summaries are saved as JSON files in the `reports/` directory:

```
reports/
├── smoke-results.json
├── integration-results.json
├── load-results.json
└── stress-results.json
```

You can inspect them with `jq` or parse them for dashboards and reporting.

Example:

```bash
jq '.metrics.http_req_duration.values."p(95)"' reports/load-results.json
```

---

## 🧪 Sample Usage in CI/CD

Set your Vault token and run:

```bash
VAULT_TOKEN=s.xxxxx make smoke-tests
```

Or use the `.env` file with `run-k6.sh`:

```bash
./run-k6.sh run scenarios/integration.test.js
```

Use `VAULT_ADDR`, `K6_CLOUD_TOKEN`, or other env vars via `__ENV` in test files for dynamic control.

---

## 🛠 Developer Notes

### 🔧 Formatting

Prettier is used to format JavaScript and JSON files. This requires Node.js, but Node is optional for everything else in this project.

To format all supported files:

```bash
make format
```

To check formatting without applying changes (useful for CI):

```bash
make check-format
```

You can customize formatting behavior with a `.prettierrc` file in the project root.

- Tests are written in JavaScript using k6's runtime (not Node.js).
- `__ENV.VAULT_TOKEN` is used to safely inject secrets.
- All tests target Vault’s HTTP API (`/v1/secret/data/...`).
- Shared logic (like header construction or data helpers) can go in `lib/`.
- Use `.env` to manage secrets and config outside of code.
- Use `run-k6.sh` to automatically load `.env` variables into test runs.
- To silence IDE errors and enable autocompletion, add a `jsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES6"
  },
  "typeAcquisition": {
    "enable": true
  },
  "types": ["k6"]
}
```

Additionally, you can add this directive at the top of each test file for full IntelliSense support:

```js
/// <reference types="k6" />
```

---

## 🗼 Cleaning Up

To remove previous test results:

```bash
make clean
```

---

## 📚 References

- https://k6.io/docs
- https://www.vaultproject.io/api-docs
- https://developer.hashicorp.com/vault/tutorials

---
