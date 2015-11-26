'use strict';

function showPageAction(tabId, changeInfo, tab) {
  chrome.pageAction.show(tabId);
}

chrome.tabs.onUpdated.addListener(showPageAction);

const BASE_URL = 'http://rest.goltsman.net/annotate';

class Event {
  constructor(event, data) {
    this.event = event;
    this.data = data;
  }
}

class TabManager {
  static executeForActiveTab(fn) {
    chrome.tabs.query({active: true, currentWindow: true}, fn);
  }
}

class MessagingService {
  static registerListeners() {
    chrome.runtime.onMessage.addListener(MessagingService.handleIncomingMessage);
  }

  static handleIncomingMessage(obj) {
    let apiTask = obj && obj.apiManger;
    switch (apiTask) {
      case "search":
        ApiManager.getByGroupsList();
        break;
      case "groups":
        ApiManager.getGroupsList();
        break;
      case "addAnnotation":
        ApiManager.getByGroupsList(obj);
        break;
      case "update":
        ApiManager.update(obj);
        break;
    }
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

  static getGroupsList() {
    TabManager.executeForActiveTab(tabs => {
      const currentURL = tabs[0].url;
      return jQuery.get(`${BASE_URL}/groups?uri=?uri=${currentURL}`).then((data) => {
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
      return jQuery.get(`${BASE_URL}/group/bgu?uri=?uri=#{currentURL}`).then((data) => {
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
      return jQuery.post(`${BASE_URL}/add`).then((data) => {
        console.log(data);
      });
    });
  }

  static update(obj) {
    TabManager.executeForActiveTab(tabs => {
      console.log(tabs);
      const currentURL = tabs[0].url;
      return jQuery.post(`${BASE_URL}/vote?uri=?uri=#{currentURL}`).then((data) => {
        console.log(data);
      });
    });
  }
}

class EventsRouter {
  static initRouting(){
    MessagingService.registerListeners((event) => {
      if(event === Events.GROUPS_GET_LIST) {
        ApiManager.getGroupsList();
      }
    })
  }
}

EventsRouter.initRouting();

console.log('\'Allo \'Allo! Event Page for Page Action Yo');
