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
      return jQuery.post(`${BASE_URL}/add`, JSON.stringify(obj)).then((data) => {
        console.log(data);
        console.log("annotation sent")
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
  static initRouting() {
    chrome.runtime.onMessage.addListener(EventsRouter.handleIncomingMessage);
  }

  static handleIncomingMessage(event) {
    let eventType = event && event.event;
    switch (eventType) {
      case Events.SEARCH:
        ApiManager.getByGroupsList();
        break;
      case Events.GROUPS:
        ApiManager.getGroupsList();
        break;
      case Events.ADD:
        ApiManager.addAnnotation(event.data);
        break;
      case Events.UPDATE:
        ApiManager.update(event.data);
        break;
    }
  }
}

EventsRouter.initRouting();

console.log('\'Allo \'Allo! Event Page for Page Action Yo');
