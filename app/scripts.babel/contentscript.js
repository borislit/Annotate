'use strict';

console.log('\'Allo \'Allo! Content script is up');


var ContentController =  {
  _onSyncCallback : _.noop,
  _data : [
    {
      quote: "Welcome to Wikipedia",
      "text" : "demo",
      "ranges" : [
        {
          end: "/div[4]/table[1]/tbody[1]/tr[1]/td[1]/table[1]/tbody[1]/tr[1]/td[1]/div[1]/a[1]",
          endOffset: 9,
          start: "/div[4]/table[1]/tbody[1]/tr[1]/td[1]/table[1]/tbody[1]/tr[1]/td[1]/div[1]",
          startOffset: 0
        }
      ]
    }
  ],

  // listen to sync events
  onSync : function(callback) {
    ContentController._onSyncCallback = function() { callback(_.clone(ContentController._data))};
  },

  // request sync
  fetch : function() {
    setTimeout(ContentController._onSyncCallback, 500);
    let event = new Event(Events.SEARCH);
    chrome.runtime.sendMessage(event, function(response) {
    });
  },

  // send updated data
  update : function(model) {
    console.info("an annotation has just been updated!", model);
    let event = new Event(Events.ADD,model);
    chrome.runtime.sendMessage(event, function(response) {
    });
  },

  // send new model
  create : function(model) {
    ContentController._data.push({
      quote : model.quote,
      text : model.text,
      ranges : _.clone(model.ranges)
    });

    ContentController._onSyncCallback();
    console.info("an annotation has just been created!", model);
    let event = new Event(Events.ADD,model);
    chrome.runtime.sendMessage(event, function(response) {
    });
  },

  // send deleted model
  destroy : function(model) {
    ContentController._data = _.without(ContentController._data, model);

    ContentController._onSyncCallback();
    console.info("an annotation has just been deleted!", model);
    //let event = new Event(Events.,model);
    //chrome.runtime.sendMessage(model, function(response) {
    //});
  }
};

Annotator.Plugin.Content = function() {
  console.log("constructor");

  return {
    pluginInit : function() {
      console.log('content plugin loaded');

      this.annotator.subscribe("annotationCreated", ContentController.create);
      this.annotator.subscribe("annotationUpdated", ContentController.update);
      this.annotator.subscribe("annotationDeleted", ContentController.destroy);

      ContentController.onSync(this.annotator.loadAnnotations.bind(this.annotator));
      ContentController.fetch();

      return this;
    }
  };
};

jQuery(function ($) {
  $('.mw-body-content').annotator();

  });

Annotator.Plugin.Content = function() {
  console.log("constructor");

  return {
    pluginInit : function() {
      console.log('content plugin loaded');

      this.annotator.subscribe("annotationCreated", ContentController.create);
      this.annotator.subscribe("annotationUpdated", ContentController.update);
      this.annotator.subscribe("annotationDeleted", ContentController.destroy);

      ContentController.onSync(this.annotator.loadAnnotations.bind(this.annotator));
      ContentController.fetch();

      chrome.runtime.onMessage.addListener(ContentController._onSyncCallback);

      return this;
    }
  };
};

jQuery(function ($) {
  console.log('Up & Running...');

  $('.mw-body-content').annotator().annotator('addPlugin', "Content");
  $("body");
});
