'use strict';

const BASE_URL = 'http://rest.goltsman.net/annotate';

class TabManager {
  static executeForActiveTab(fn) {
    chrome.tabs.query({active: true, currentWindow: true}, fn);
  }
}

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
        TabManager.executeForActiveTab(tabs => {
          chrome.tabs.sendMessage(tabs[0].id, data, function (response) {
            console.log(response, 'Tab message response received');
          });
        });
      }
    });
  }
}

class ApiManager {

  constructor() {

  }

  static getGroupsList() {
    TabManager.executeForActiveTab(tabs => {
      const currentURL = tabs[0].url;
      return jQuery.get(`${BASE_URL}/groups?uri=?uri=${currentURL}`).then((data) => {
        MessagingService.sendRuntimeMessage(data.groups);
      });
    });
  }

  static getByGroupsList() {
    TabManager.executeForActiveTab(tabs => {
      console.log(tabs);
      const currentURL = "https://en.wikipedia.org/wiki/Infection";//tabs[0].url;
      return jQuery.get(`${BASE_URL}/group/bgu?uri=?uri=#{currentURL}`).then((data) => {
        console.log(data);
      });
    });
  }

  static addAnnotation() {
    TabManager.executeForActiveTab(tabs => {
      console.log(tabs);
      const currentURL = tabs[0].url;
      return jQuery.post(`${BASE_URL}/add`).then((data) => {
        console.log(data);
      });
    });
  }

  static vote() {
    TabManager.executeForActiveTab(tabs => {
      console.log(tabs);
      const currentURL = tabs[0].url;
      return jQuery.post(`${BASE_URL}/vote?uri=?uri=#{currentURL}`).then((data) => {
        console.log(data);
      });
    });
  }
}

MessagingService.registerListeners();

console.log('\'Allo \'Allo! Event Page for Page Action Yo');
