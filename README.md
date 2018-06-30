# universal-stream-test
the simplest way to run tests against your console/stdout, works in-browser and in Node.js, used to test morgan-body: https://github.com/sirrodgepodge/morgan-body/

## Usage
Just pass in a function for each line of console that you would like to test, each function will be fed the output corresponding to that line.
```js
import universalStreamTest from 'universal-stream-test';

function aFeatureForWhichYoudLikeToTestTheConsoleOutput() {
  console.log('hello there');
  console.log('I think');
  console.log('that I am');
  console.log('working!');
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
```

## Options
By default tests 'process.stdout' if run in Node.js and 'console.log' if run in a browser, however it can be used to test any stream.
```js
import universalStreamTest from 'universal-stream-test';

const configuredStreamTest = getConfiguredStreamTest({
  stream: process.stderr, // the stream object
  streamActionName: 'write', // the name of the method on the stream object used to write to the stream
});

// example usage testing console.warn
const consoleWarnTest = getConfiguredStreamTest({
  stream: console,
  streamActionName: 'warn'
});

function warnMe() {
  console.warn('you');
  console.warn('have been warned!');
}

describe("am I getting warned", function () {
  const warnTestPromise = consoleWarnTest(
    line => expect('you'), 
    line => expect('have been warned!')
  );
  
  warnMe();
  
  return warnTestPromise;
})
```
