'use strict';

console.log('\'Allo \'Allo! Content script is up');


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

  // request sync
  fetch: function (callback) {
    var proxy = function (data) {
      console.info("fetch() data-> ", data);
      callback(_.clone(data));
    };

    chrome.runtime.onMessage.addListener(proxy);
    chrome.runtime.sendMessage(new Event(Events.SEARCH, "sce"));
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
Annotator.Plugin.Content = function () {
  return {
    pluginInit: function () {
      console.log('content plugin loaded');

      var annotator = this.annotator;
      var onSync = function(data) {
        //TODO: remove before loading new
        annotator.loadAnnotations(data);
      };

      annotator.subscribe("annotationCreated", ContentController.create);
      annotator.subscribe("annotationUpdated", ContentController.update);
      annotator.subscribe("annotationDeleted", ContentController.destroy);
      this.annotator.subscribe("annotationViewerShown", ContentController.annotationLoaded.bind(ContentController));

      ContentController.fetch(onSync);

      return this;
    }
  };
};



jQuery(function ($) {
  console.log('Up & Running...');

  $("body").on("click",".thumb-up", function (e) {
    //e.preventDefault();
    console.log("up",ContentController.lastAnnotationShown)
  });

  $("body").on("click",".thumb-down", function (e) {
    //e.preventDefault();
    console.log("down",ContentController.lastAnnotationShown)
  });

  $('.mw-body-content').annotator().annotator('addPlugin', "Content");
});
