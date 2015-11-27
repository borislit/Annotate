'use strict';

console.log('\'Allo \'Allo! Content script is up');

var initPlugin = function(data) {
  console.log("-----");
  $('.mw-body-content').annotator().annotator('addPlugin', "Content", data);
};

var ContentController = {
  defualtModle: function () {
    return {
      "annotator_schema_version": "v1.0",
      "created": new Date().toISOString(),
      "updated": new Date().toISOString(),
      "uri": window.location.href,
      "user": "alice",
      "ranges": [
        {
          "start": "",
          "end": "",
          "startOffset": 0,
          "endOffset": 1
        }
      ],
      "consumer": "annotateit",
      "group": "sce"
    };
  },

  _onDestroy : _.noop,

  // request sync
  init: function () {
   var proxy = function(data) {
     ContentController._onDestroy();
     initPlugin(data);
   };

    chrome.runtime.onMessage.addListener(proxy);
    chrome.runtime.sendMessage(new Event(Events.SEARCH, "sce"));
  },

  registerOnDestroy : function(func) {
    ContentController._onDestroy = func;
  },

  // send updated data
  update: function (model) {
    console.info("an annotation has just been updated!", model);
    chrome.runtime.sendMessage(new Event(Events.ADD, model));
  },

  // send new model
  create: function (model) {
    console.info("an annotation has just been created!", model);
    model = _.defaults(model, ContentController.defualtModle());
    chrome.runtime.sendMessage(new Event(Events.ADD, model));
  },

  // send deleted model
  destroy: function (model) {
    console.info("an annotation has just been deleted!", model);
    // TODO: add destory
  },

  annotationLoaded: function(view,annotation){
    console.log(annotation);
    ContentController.lastAnnotationShown = annotation;
  },
  getLastAnnotationShown:function(){
    return ContentController.lastAnnotationShown;
  }
};


Annotator.Viewer.prototype.html = {
  element: '<div class="annotator-outer annotator-viewer">  <ul class="annotator-widget annotator-listing"></ul></div>',
  item: '<li class="annotator-annotation annotator-item">  <img src="http://localhost:9000/images/down.png" class="thumb-down"><img src="http://localhost:9000/images/up.png" class="thumb-up"></li>'
};

Annotator.Plugin.Content = function (element, data) {
  return {
    pluginInit: function () {
      console.log('content plugin loaded');

      var annotator = this.annotator;

      annotator.subscribe("annotationCreated", ContentController.create);
      annotator.subscribe("annotationUpdated", ContentController.update);
      annotator.subscribe("annotationDeleted", ContentController.destroy);
      annotator.subscribe("annotationViewerShown", ContentController.annotationLoaded.bind(ContentController));

      ContentController.registerOnDestroy(annotator.destroy.bind(annotator));
      annotator.loadAnnotations(data);

      return this;
    }
  };
};



jQuery(function ($) {
  console.log('Up & Running...');

  $("body").on("click",".thumb-up", function () {
    console.log("up",ContentController.lastAnnotationShown)
  });

  $("body").on("click",".thumb-down", function () {
    console.log("down",ContentController.lastAnnotationShown)
  });

  ContentController.init();
});
