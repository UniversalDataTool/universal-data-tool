# Integration Tests

To run integration tests, you must have the Universal Data Tool running on
http://localhost:6001.

All the tests are executed by running `yarn test:integration` or `npm run test:integration` in the
top-level directory.

## Adding / Deleting Tests

Generally speaking, core functionality that is easy to test should be tested,
and difficult parts, especially those with third-party APIs that is prone to
frequent breakage should not be tested with an integration test. Electron/desktop-specific
functionality is not currently tested because it requires a slightly different
test fixture.

If you have new functionality that breaks a test (and the breakage is
intentional, e.g. you're replacing a page with a new design), you can delete
the `*.spec.js` file that is failing. A project maintainer may ask you to create
a new test to replace it but usually not.

## Test Examples

Cypress provides a great directory of test examples here:

https://github.com/cypress-io/cypress-example-kitchensink/tree/master/cypress/integration/examples

Looking through the examples should show you what you can do.
