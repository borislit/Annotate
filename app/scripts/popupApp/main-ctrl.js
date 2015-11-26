'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MainCtrl = function MainCtrl(GroupsService) {
    //GroupsService.getGroupsList().then((groups) => {
    //  this.groups = groups;
    //});

    _classCallCheck(this, MainCtrl);
  };

  MainCtrl.$inject = ['GroupsService'];

  angular.module('annotate').controller('MainCtrl', MainCtrl);
})();
//# sourceMappingURL=main-ctrl.js.map
