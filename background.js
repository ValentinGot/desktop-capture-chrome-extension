var screenOptions = ['screen', 'window'];

function onConnect (port) {
  port.onMessage.addListener(onMessage);

  /**
   * On `main.js` message
   *
   * @param {{room: string, sender: string, name: string}} message
   */
  function onMessage (message) {
    if (message.name === 'source-id') {
      chrome.desktopCapture.chooseDesktopMedia(screenOptions, port.sender.tab, function (sourceId) {
        if(!sourceId || !sourceId.length) {
          return port.postMessage({
            room: message.room,
            sender: 'extension',
            name: 'error',
            err: 'Request cancelled or permission denied'
          });
        }

        port.postMessage({
          room: message.room,
          sender: 'extension',
          name: message.name,
          sourceId: sourceId
        });
      });
    }
  }
}

// Events
chrome.runtime.onConnect.addListener(onConnect);
