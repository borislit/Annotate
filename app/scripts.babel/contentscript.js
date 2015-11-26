'use strict';

console.log('\'Allo \'Allo! Content script');

jQuery(function ($) {
  $('.mw-body-content').annotator();

  chrome.runtime.sendMessage({apiManger: "search"}, function(response) {
    console.log(response.farewell);
  });

  chrome.runtime.onMessage.addListener((data) => {
    console.log('Got Message', data);
  });

});
