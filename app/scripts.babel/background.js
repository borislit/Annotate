'use strict';

class MessagingService {
  static registerListeners() {
    chrome.runtime.onMessage.addListener(MessagingService.handleIncomingMessage);
  }

  static handleIncomingMessage() {
    console.log('Got message');
  }

  static sendRuntimeMessage(data) {
    chrome.runtime.sendMessage(data, () => {
      console.log('Response received for runtime');
    });
  }

  static sendTabMessage(data) {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
      if (changeInfo.status === 'complete') {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, data, function (response) {
            console.log(response, 'Tab message response received');
          });
        });
      }
    });
  }
}

MessagingService.registerListeners();

MessagingService.sendTabMessage('Hey yo');
MessagingService.sendTabMessage('Hey yo 123');

console.log('\'Allo \'Allo! Event Page for Page Action Yo');
