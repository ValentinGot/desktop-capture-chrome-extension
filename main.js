var ROOM = 'desktop-capture';

/**
 * A message has been received trough the postMessage API
 *
 * @param {MessageEvent} e
 */
function onMessage (e) {
  var message = e.data;

  if (message.room && message.room === ROOM && message.sender && message.sender === 'client') {
    console.log('Desktop capture :: message received :: ', e.data);

    switch (message.name) {

      // Someone wants to know if i'm loaded
      case 'loaded':
        window.postMessage({
          room: ROOM,
          sender: 'extension',
          name: 'available'
        }, e.origin);
        break;

      // Someone wants to retrieve a source ID
      // Let's forward the message to the background script
      case 'source-id':
        port.postMessage(message);
        break;
    }
  }
}

/**
 * A message has been received from the background script
 * Just forward it to the web page
 *
 * @param {{room: string, sender: string, name: string, sourceId?: string, err?: string}} message
 */
function onBackgroundMessage (message) {
  console.log('Chrome desktop :: background message :: ', message);

  window.postMessage(message, '*');
}

// Connect to the background script
var port = chrome.runtime.connect();

// Events
window.addEventListener('message', onMessage);
port.onMessage.addListener(onBackgroundMessage);
