import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    toggleFollow: function(user) {
      user.toggleProperty('followedByAuthenticatedUser');
      user.set('operation', user.get('followedByAuthenticatedUser') ? "follow" : "unfollow");
      user.save();
    }
  }
});
