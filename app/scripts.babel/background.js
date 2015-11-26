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
  static registerListeners(listener) {
    chrome.runtime.onMessage.addListener(listener);
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
      const currentURL = 'https://en.wikipedia.org/wiki/Infection'; //tabs[0].url;
      return jQuery.get(`${BASE_URL}/groups?uri=${currentURL}`).then((data) => {
        const event = new Event(Events.GROUP_LIST_UPDATED, JSON.parse(data).groups);
        MessagingService.sendRuntimeMessage(event);
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
