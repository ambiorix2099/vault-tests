VERBOSE ?= false
SILENT = $(if $(filter true,$(VERBOSE)),,@)

all : smoke-tests integration-tests load-tests stress-tests

smoke-tests:
	$(SILENT)./run-k6.sh run --out json=reports/smoke-results.json scenarios/smoke.test.js

integration-tests:
	$(SILENT)./run-k6.sh run --out json=reports/integration-results.json scenarios/integration.test.js

load-tests:
	$(SILENT)./run-k6.sh run --out json=reports/load-results.json scenarios/load.test.js

stress-tests:
	$(SILENT)./run-k6.sh run --out json=reports/stress-results.json scenarios/stress.test.js

clean:
	$(SILENT)rm -f reports/*.json

format:
	$(SILENT)npx prettier --write .

check-format:
	$(SILENT)npx prettier --check .

.PHONY: all smoke-tests integration-tests load-tests stress-tests clean format check-format
