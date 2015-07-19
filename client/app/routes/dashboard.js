import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),

  beforeModel: function(transition) {
    var authenticatedUser = this.get('session.authenticatedUser');
    if (!authenticatedUser) {
      this.transitionTo('auth.login');
    }
  },

  model: function() {
    this.get('session.authenticatedUser');
    return this.store.find('post');
  }
});
