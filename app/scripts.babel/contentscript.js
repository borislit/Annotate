'use strict';

console.log('\'Allo \'Allo! Content script is up');


var ContentController =  {

  // request sync
  fetch : function(callback) {
    var proxy = _.once(function(data) {
      console.info("fetch() data-> ", data);
      callback(_.clone(data));
    });

    chrome.runtime.onMessage.addListener(proxy);
    chrome.runtime.sendMessage({apiManger: "search"});
  },

  // send updated data
  update : function(model) {
    console.info("an annotation has just been updated!", model);
    chrome.runtime.sendMessage({apiManger: "addAnnotation",model});
  },

  // send new model
  create : function(model) {
    console.info("an annotation has just been created!", model);
    chrome.runtime.sendMessage({apiManger: "addAnnotation",model});
  },

  // send deleted model
  destroy : function(model) {
    console.info("an annotation has just been deleted!", model);
    chrome.runtime.sendMessage(model);
  }
};

Annotator.Plugin.Content = function() {
  return {
    pluginInit : function() {
      console.log('content plugin loaded');

      this.annotator.subscribe("annotationCreated", ContentController.create);
      this.annotator.subscribe("annotationUpdated", ContentController.update);
      this.annotator.subscribe("annotationDeleted", ContentController.destroy);

      ContentController.fetch(this.annotator.loadAnnotations.bind(this.annotator));

      return this;
    }
  };
};

jQuery(function ($) {
  console.log('Up & Running...');

  $('.mw-body-content').annotator().annotator('addPlugin', "Content");
});
