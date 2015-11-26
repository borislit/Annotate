'use strict';

console.log('\'Allo \'Allo! Content script');

jQuery(function ($) {
  $('.mw-body-content').annotator();

  chrome.runtime.onMessage.addListener(function (data) {
    console.log('Got Message', data);
  });
});
//# sourceMappingURL=contentscript.js.map
