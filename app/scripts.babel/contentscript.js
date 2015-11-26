'use strict';

console.log('\'Allo \'Allo! Content script');

jQuery(function ($) {
  console.log('Done 4');
  $('.mw-body-content').annotator();

  chrome.runtime.onMessage.addListener((data) => {
    console.log('Got Message', data);
  });

});
