import Ember from 'ember';

export default Ember.Route.extend({

  session: Ember.inject.service('session'),

  beforeModel: function() {
    var route = this;
    var promise = this.store.find('user', {isAuthenticated: true});
    return promise.then(function(users) {
      if (users && users.get('length') > 0) {
        var user = users.get('firstObject');
        route.set('session.authenticatedUser', user);
      }
    return users;
    });
  },

  actions: {
    logOut: function() {
      var controller = this;
      controller.get('session').set('authenticatedUser', null);
      Ember.$.post("/api/logout", function() {
        controller.store.unloadAll('post');
        controller.store.unloadAll('user');
        controller.transitionTo('auth.login');
      });
    }
  }
});
