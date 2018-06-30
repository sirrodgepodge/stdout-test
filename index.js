const inBrowser = typeof window !== 'undefined';

// accepts argument array of functions, runs each function one by one with console output
module.exports = function stdOutTest(...arr) {
  let stream;
  if (this && this.stream) {
    stream = this.stream;
  } else if (inBrowser) {
    stream = console;
  } else {
    stream = process.stdout;
  }

  let streamActionName;
  if (this && this.streamActionName) {
    streamActionName = this.streamActionName
  } else if (inBrowser) {
    streamActionName = 'log';
  } else {
    streamActionName = 'write';
  }

  const arrLength = arr.length;
  let callCount = 0;

  return new Promise((resolve, reject) => {
    try {
      stdOutListen(stream, streamActionName, function cb(line) {
        try {
          arr[callCount](line);
        } catch(e) {
          removeStreamListeners(stream, streamActionName);
          console.log({ callCount });
          return reject(e);
        }
        if (callCount === arrLength - 1) {
          removeStreamListeners();
          resolve();
        } else {
          callCount++;
        }
      });
    } catch(e) {
      removeStreamListeners();
      console.log({ callCount });
      reject(e);
    }
  })
}

module.exports.getConfiguredStreamTest = options => module.exports.bind(options);

const throwIfNotListening = () => {
  throw new Error('universal-stream-test: tried to remove stream listeners, no currently listening stream');
};
var removeStreamListeners = throwIfNotListening;

function stdOutListen(stream, streamActionName, callback) {
  const origWriteStream = stream[streamActionName];
  removeStreamListeners = () => {
    stream[streamActionName] = origWriteStream;
    removeStreamListeners = throwIfNotListening;
  }
  stream[streamActionName] = (function(writeToStream) {
    return function(string, encoding, fd) {
      writeToStream.apply(stream, arguments); // actually do write to stream still
      callback(string, encoding, fd)
    }
  })(stream[streamActionName]);
}
