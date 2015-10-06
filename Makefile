TESTS = test/*.js
test:
	mocha --timeout 30000 --reporter nyan $(TESTS)

.PHONY: test
