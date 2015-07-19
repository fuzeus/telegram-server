import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  notAuthenticatedUser: function () {
    return this.get('model') !== this.get('session.authenticatedUser');
  }.property('model', 'session.authenticatedUser'),

  actions: {
    toggleFollowCurrentUser: function() {
      this.send('toggleFollow', this.get('model'));

      /* TODO: test this action works

      Old code:

      var model = this.get('model');
      model.toggleProperty('followedByAuthenticatedUser');
      model.set('operation', model.get('followedByAuthenticatedUser') ? "follow" : "unfollow");
      model.save();
      */
    }
  }
});
