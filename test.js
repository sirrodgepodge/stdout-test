const universalStreamTest = require('./');
const expect = require('chai').expect;

function aFeatureForWhichYoudLikeToTestTheConsoleOutput() {
  process.stdout.write('hello there');
  process.stdout.write('I think');
  process.stdout.write('that I am');
  process.stdout.write('working!');
}

describe("a feature for which you'd like to test the console output", function () {
  it("should log to the console correctly", function () {

    // by default tests 'process.stdout' if run in Node.js and 'console.log' if run in a browser
    const streamTestPromise = universalStreamTest( // returns a promise that will complete once a number of stream writes equal to the number of functions passed in has occurred
      line => expect(line).to.equal('hello there'),
      line => expect(line).to.equal('I think'),
      line => expect(line).to.equal('that I am'),
      line => expect(line).to.equal('working!')
    );

    aFeatureForWhichYoudLikeToTestTheConsoleOutput();

    return streamTestPromise;
  });
});

// example usage testing console.warn
const consoleWarnTest = universalStreamTest.getConfiguredStreamTest({
  stream: console,
  streamActionName: 'warn'
});

function warnMe() {
  console.warn('you');
  console.warn('have been warned!');
}

describe("am I getting warned", function () {
  it("should write to console warn", () => {
    const warnTestPromise = consoleWarnTest(
      line => expect(line).to.equal('you'),
      line => expect(line).to.equal('have been warned!')
    );

    warnMe();

    return warnTestPromise;
  })
})
