'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var GroupsService = (function () {
    function GroupsService($http, $location) {
      _classCallCheck(this, GroupsService);

      this.$http = $http;
      this.$location = $location;
    }

    _createClass(GroupsService, [{
      key: 'getGroupsList',
      value: function getGroupsList() {
        return this.$http.get('http://rest.goltsman.net/annotate/groups?uri=' + this.$location.absUrl()).then(function (data) {
          return data.groups;
        });
      }
    }]);

    return GroupsService;
  })();

  GroupsService.$inject = ['$http', '$location'];

  angular.module('annotate').service('GroupsService', GroupsService);
})(angular);
//# sourceMappingURL=groups-service.js.map
