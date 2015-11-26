(function (angular) {
  console.log('Const Def');
  angular.module('annotate').constant('Events', {
    GROUP_LIST_UPDATED: 'groups.list-updated',
    GROUPS_GET_LIST: 'groups.get-list'
  });
})(angular);
