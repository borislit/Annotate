'use strict';

console.log('\'Allo \'Allo! Content script');

jQuery(function ($) {
  console.log('Done 4');
  $('.mw-body-content').annotator();

  chrome.runtime.onMessage.addListener(function (data) {
    console.log('Got Message', data);
  });
});
//# sourceMappingURL=contentscript.js.map
