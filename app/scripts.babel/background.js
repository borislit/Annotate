'use strict';

class MessagingService {
  static registerListeners() {
    chrome.runtime.onMessage.addListener(MessagingService.handleIncomingMessage);
  }

  static handleIncomingMessage() {
    console.log('Got message');
  }

  static sendRuntimeMessage(data) {
    chrome.runtime.sendMessage(data, (response) => {
      console.log(response);
    });
  }

  static sendTabMessage(data) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, data, (response) => {
        console.log(response);
      });
    });
  }

}

MessagingService.registerListeners();

console.log('\'Allo \'Allo! Event Page for Page Action Yo');

