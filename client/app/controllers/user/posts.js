import Ember from 'ember';

export default Ember.ArrayController.extend({
  session: Ember.inject.service('session'),

  sortProperties: ['createdDate'],
  sortAscending: false
});
