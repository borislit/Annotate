'use strict';

function showPageAction(tabId, changeInfo, tab) {
  chrome.pageAction.show(tabId);
}

chrome.tabs.onUpdated.addListener(showPageAction);

const BASE_URL = 'http://rest.goltsman.net/annotate';

class TabManager {
  static executeForActiveTab(fn) {
    chrome.tabs.query({active: true, currentWindow: true}, fn);
  }
}

class MessagingService {
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
  static getGroupsList() {
    TabManager.executeForActiveTab(tabs => {
      const currentURL = tabs[0].url;
      return jQuery.get(`${BASE_URL}/groups?uri=${currentURL}`).then((data) => {
        console.log(data);
        chrome.tabs.sendMessage(tabs[0].id, data, function (response) {

        });
        // MessagingService.sendRuntimeMessage(data.groups);
      });
    });
  }

  static getByGroupsList() {
    TabManager.executeForActiveTab(tabs => {
      console.log(tabs);
      const currentURL = tabs[0].url;
      return jQuery.get(`${BASE_URL}/group/bgu?uri=${currentURL}`).then((data) => {
        data = JSON.parse(data);
        console.log(data.annotations);
        chrome.tabs.sendMessage(tabs[0].id, data.annotations, function (response) {

        });
      });
    });
  }

  static addAnnotation(obj) {
    TabManager.executeForActiveTab(tabs => {
      console.log(tabs);
      const currentURL = tabs[0].url;
      return jQuery.post(`${BASE_URL}/add`, obj).then((data) => {
        console.log(data);
      });
    });
  }

  static update(obj) {
    TabManager.executeForActiveTab(tabs => {
      console.log(tabs);
      const currentURL = tabs[0].url;
      return jQuery.post(`${BASE_URL}/vote?uri=${currentURL}`, obj).then((data) => {
        console.log(data);
      });
    });
  }
}


class EventsRouter {

  constructor(manager) {
    this._manager = manager;
  }

  start() {
    console.log('\'Allo \'Allo! Event Page for Page Action Yo');

    chrome.runtime.onMessage.addListener(this.handleIncomingMessage);
    return this;
  }

  handleIncomingMessage(event) {
    let eventType = event && event.event;
    let manager = this._manager;

    switch (eventType) {
      case Events.SEARCH:
        manager.getByGroupsList();
        break;
      case Events.GROUPS:
        manager.getGroupsList();
        break;
      case Events.ADD:
        manager.getByGroupsList(event.data);
        break;
      case Events.UPDATE:
        manager.update(event.data);
        break;
    }
  }
}

new EventsRouter(ApiManager).start();
