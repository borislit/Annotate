'use strict';

function showPageAction(tabId, changeInfo, tab) {
  chrome.pageAction.show(tabId);
}

chrome.tabs.onUpdated.addListener(showPageAction);

const BASE_URL = 'http://rest.goltsman.net/annotate';

class TabManager {
  static executeForActiveTab(fn) {
    chrome.tabs.query({active: true}, fn);
  }
}

class MessagingService {
  static sendRuntimeMessage(data) {
    chrome.runtime.sendMessage(data, () => {
      console.log('Response received for runtime');
    });
  }

  static sendTabMessage(data) {
    TabManager.executeForActiveTab(tabs => {
      console.log('Tab Message Sent');
      chrome.tabs.sendMessage(tabs[0].id, data);
    });
  }
}

class ApiManager {

  static getGroupsList() {
    TabManager.executeForActiveTab(tabs => {
      const currentURL = tabs[0].url;
      return jQuery.get(`${BASE_URL}/groups?uri=${currentURL}`).then((data) => {
        MessagingService.sendRuntimeMessage(new Event(Events.GROUP_LIST_UPDATED, JSON.parse(data).groups));
      });
    });
  }

  static getByGroupsList(group) {
    console.log('Get By Group', group);
    TabManager.executeForActiveTab(tabs => {
      const currentURL = 'https://en.wikipedia.org/wiki/Infection'; //tabs[0].url;
      return jQuery.get(`${BASE_URL}/group/${group}?uri=${currentURL}`).then((data) => {
        data = JSON.parse(data);
        console.log(data.annotations);
        MessagingService.sendTabMessage(data.annotations);
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

  constructor(manager) {
    this._manager = manager;
  }

  start() {
    console.log('\'Allo \'Allo! Event Page for Page Action Yo');

    chrome.runtime.onMessage.addListener(this.handleIncomingMessage.bind(this));
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
        manager.addAnnotation(event.data);
        break;
      case Events.UPDATE:
        manager.update(event.data);
        break;
    }
  }
}

new EventsRouter(ApiManager).start();
