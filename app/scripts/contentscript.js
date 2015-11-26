'use strict';

console.log('\'Allo \'Allo! Content script');

jQuery(function ($) {
  console.log('Done 3');

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.greeting == "hello") sendResponse({ farewell: "goodbye" });
  });

  Annotator.Plugin.Message = function (element, message) {
    console.log('Done 123');
    //debugger;
    var plugin = {};

    plugin.pluginInit = function () {
      this.annotator.viewer.addField({
        load: function load(field) {
          field.innerHTML = message;
        }
      });
    };

    return plugin;
  };

  Annotator.Plugin.Store.prototype.loadAnnotationsFromSearch = function () {
    var myResponse = {};
    myResponse.rows = [{ "ranges": [{ "start": "/div[4]/table[1]/tbody[1]/tr[1]/td[2]/div[1]/table[2]/tbody[1]/tr[1]/td[1]/div[1]/p[1]", "startOffset": 211, "end": "/div[4]/table[1]/tbody[1]/tr[1]/td[2]/div[1]/table[2]/tbody[1]/tr[1]/td[1]/div[1]/p[1]", "endOffset": 227 }], "quote": "ורות בכך שמתי ול", "highlights": [{}], "text": "ofirbla" }];
    this._onLoadAnnotationsFromSearch(myResponse);
  };

  $('.mw-body-content').annotator().annotator('addPlugin', 'Message', 'Store', {
    // The endpoint of the store on your server.
    prefix: '/store/endpoint',

    // Attach the uri of the current page to all annotations to allow search.
    annotationData: {
      'uri': 'http://this/document/only'
    },

    // This will perform a "search" action when the plugin loads. Will
    // request the last 20 annotations for the current url.
    // eg. /store/endpoint/search?limit=20&uri=http://this/document/only
    loadFromSearch: {
      'limit': 20,
      'uri': 'http://this/document/only'
    }
  });
});
//# sourceMappingURL=contentscript.js.map
