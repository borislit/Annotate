'use strict';

console.log('\'Allo \'Allo! Content script');

jQuery(function ($) {
  console.log('Done 4');
  $('.mw-body-content').annotator()
    .annotator('addPlugin', 'Store', {
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
  }).annotator('addPlugin', 'Categories', {
    categories: ['Yossi'],
    categoryColorClasses: {'Yossi':'gg'},
    categoryClass: 'annotator-category',
    classForSelectedCategory: 'annotator-category-selected',
    emptyCategory: 'Highlight',
    annotatorHighlight: 'span.annotator-hl'
  });

  $('body').append('<div class="annotate-controls">Text Text</div>');

});
