TESTS = test/*.js
test:
	mocha --timeout 3000 --reporter nyan $(TESTS)

.PHONY: test
