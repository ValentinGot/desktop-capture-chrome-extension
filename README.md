# desktop-capture-chrome-extension

**WebRTC experiments**

The extension retrieve the source ID of any screen/window and return it to your web page.

> **Warning**
>
> Google Chrome only

## Web page sample

```js
var ROOM = 'desktop-capture',
  _chromeExtensionAvailable = false;

/**
 * Test if the chrome extension for desktop capture is available
 *
 * @param {function} resolve
 * @param {function} reject
 */
function isChromeExtensionAvailable (resolve, reject) {
  window.postMessage({
    room: ROOM,
    sender: 'client',
    name: 'loaded'
  }, '*');

  setTimeout(function () {
    if (_chromeExtensionAvailable) {
      resolve();
    } else {
      reject();
    }
  }, 1000);
}

/**
 * Retrieve the user media stream and display it
 *
 * @param {string} sourceId
 */
function getUserMedia (sourceId) {
  navigator.webkitGetUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sourceId,
        maxWidth: screen.width > 1920 ? screen.width : 1920,
        maxHeight: screen.height > 1080 ? screen.height : 1080
      }
    }
  }, function (stream) {
    document.querySelector('#video').src = window.URL.createObjectURL(stream);

    stream.addEventListener('ended', function () {
      console.error('Plugin :: Desktop capture :: Stream as ended');
    });
  }, function (err) {
    console.error(err);
  });
}

/**
 * A message has been received trough the postMessage API
 *
 * @param {MessageEvent} e
 */
function onMessage (e) {
  var message = e.data;

  if (message.room && message.room === ROOM && message.sender && message.sender === 'extension') {
    console.log('Plugin :: Desktop capture :: message received :: ', message);

    switch (message.name) {

      // The chrome desktop extension is available
      case 'available':
        _chromeExtensionAvailable = true;
        break;

      // The source ID has been received
      case 'source-id':
        getUserMedia(message.sourceId);
        break;
    }
  }
}

isChromeExtensionAvailable(function () {
  console.info('Plugin :: Desktop capture :: Extension available');

  // Request the screen id
  window.postMessage({
    room: ROOM,
    sender: 'client',
    name: 'source-id'
  }, '*');
}, function () {
  console.error('Plugin :: Desktop capture :: Extension NOT available');
});

window.addEventListener('message', onMessage);
```
