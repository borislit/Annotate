'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function showPageAction(tabId, changeInfo, tab) {
  chrome.pageAction.show(tabId);
}

chrome.tabs.onUpdated.addListener(showPageAction);

var BASE_URL = 'http://rest.goltsman.net/annotate';

var Event = function Event(event, data) {
  _classCallCheck(this, Event);

  this.event = event;
  this.data = data;
};

var TabManager = (function () {
  function TabManager() {
    _classCallCheck(this, TabManager);
  }

  _createClass(TabManager, null, [{
    key: 'executeForActiveTab',
    value: function executeForActiveTab(fn) {
      chrome.tabs.query({ active: true, currentWindow: true }, fn);
    }
  }]);

  return TabManager;
})();

var MessagingService = (function () {
  function MessagingService() {
    _classCallCheck(this, MessagingService);
  }

  _createClass(MessagingService, null, [{
    key: 'registerListeners',
    value: function registerListeners() {
      chrome.runtime.onMessage.addListener(MessagingService.handleIncomingMessage);
    }
  }, {
    key: 'handleIncomingMessage',
    value: function handleIncomingMessage(obj) {
      var apiTask = obj && obj.apiManger;
      switch (apiTask) {
        case "search":
          ApiManager.getByGroupsList();
          break;
        case "groups":
          ApiManager.getGroupsList();
          break;
        case "addAnnotation":
          ApiManager.getByGroupsList();
          break;
        case "vote":
          ApiManager.vote();
          break;
      }
    }
  }, {
    key: 'sendRuntimeMessage',
    value: function sendRuntimeMessage(data) {
      chrome.runtime.sendMessage(data, function () {
        console.log('Response received for runtime');
      });
    }
  }, {
    key: 'sendTabMessage',
    value: function sendTabMessage(data) {
      chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
        if (changeInfo.status === 'complete') {
          TabManager.executeForActiveTab(function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, data, function (response) {
              console.log(response, 'Tab message response received');
            });
          });
        }
      });
    }
  }]);

  return MessagingService;
})();

var ApiManager = (function () {
  function ApiManager() {
    _classCallCheck(this, ApiManager);
  }

  _createClass(ApiManager, null, [{
    key: 'getGroupsList',
    value: function getGroupsList() {
      TabManager.executeForActiveTab(function (tabs) {
        var currentURL = tabs[0].url;
        return jQuery.get(BASE_URL + '/groups?uri=?uri=' + currentURL).then(function (data) {
          console.log(data);
          chrome.tabs.sendMessage(tabs[0].id, data, function (response) {});
          // MessagingService.sendRuntimeMessage(data.groups);
        });
      });
    }
  }, {
    key: 'getByGroupsList',
    value: function getByGroupsList() {
      TabManager.executeForActiveTab(function (tabs) {
        console.log(tabs);
        var currentURL = tabs[0].url;
        return jQuery.get(BASE_URL + '/group/bgu?uri=?uri=#{currentURL}').then(function (data) {
          data = JSON.parse(data);
          console.log(data.annotations);
          chrome.tabs.sendMessage(tabs[0].id, data.annotations, function (response) {});
        });
      });
    }
  }, {
    key: 'addAnnotation',
    value: function addAnnotation() {
      TabManager.executeForActiveTab(function (tabs) {
        console.log(tabs);
        var currentURL = tabs[0].url;
        return jQuery.post(BASE_URL + '/add').then(function (data) {
          console.log(data);
        });
      });
    }
  }, {
    key: 'vote',
    value: function vote() {
      TabManager.executeForActiveTab(function (tabs) {
        console.log(tabs);
        var currentURL = tabs[0].url;
        return jQuery.post(BASE_URL + '/vote?uri=?uri=#{currentURL}').then(function (data) {
          console.log(data);
        });
      });
    }
  }]);

  return ApiManager;
})();

var EventsRouter = (function () {
  function EventsRouter() {
    _classCallCheck(this, EventsRouter);
  }

  _createClass(EventsRouter, null, [{
    key: 'initRouting',
    value: function initRouting() {
      MessagingService.registerListeners(function (event) {
        if (event === Events.GROUPS_GET_LIST) {
          ApiManager.getGroupsList();
        }
      });
    }
  }]);

  return EventsRouter;
})();

EventsRouter.initRouting();

console.log('\'Allo \'Allo! Event Page for Page Action Yo');
//# sourceMappingURL=background.js.map
