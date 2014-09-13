lint:
	@./node_modules/.bin/jshint ./lib/*.js ./test/*.js ./example/main.js index.js

test:
	@$(MAKE) lint
	@./node_modules/.bin/testling

test-cov:
	@$(MAKE) lint
	@./node_modules/.bin/browserify -t coverify test/media-query-facade.test.js \
		| ./node_modules/.bin/testling \
		| ./node_modules/.bin/coverify

example:
	@$(MAKE) lint
	@browserify example/main.js > example/bundle.js
	@open example/index.html

.PHONY: lint test test-cov example