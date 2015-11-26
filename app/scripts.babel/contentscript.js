'use strict';

console.log('\'Allo \'Allo! Content script');

jQuery(function ($) {
  $('.mw-body-content').annotator();

  chrome.runtime.onMessage.addListener((data) => {
    console.log('Got Message', data);
  });

});
