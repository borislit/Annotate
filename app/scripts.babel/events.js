// jshint ignore: start
class Event {
  constructor(event, data) {
    this.event = event;
    this.data = data;
  }
}

const Events = {
  GROUP_LIST_UPDATED: 'groups.list-updated',
  GROUPS_GET_LIST: 'groups.get-list',
  SEARCH:'search',
  GROUPS:'groups',
  ADD:'addAnnotation',
  UPDATE:'update'
};