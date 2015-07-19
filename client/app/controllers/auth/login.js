import Ember from 'ember';

/* global md5 */

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  username: '',
  password: '',
  error: null,

  actions: {
    login: function() {
      var username = this.get('username');
      var password = this.get('password');
      var controller = this;

      if (Ember.isEmpty(username)) {
        return this.set('error', 'Please enter username');
      }

      if (Ember.isEmpty(password)) {
        return this.set('error', 'Please enter password');
      }

      var user = this.store.createRecord('user', {
        id: username,
        password: md5( username + password),
        operation: 'login'
      });

      user.save().then(function(user) {
        controller.get('session').set('authenticatedUser', user);
        controller.set('username', null);
        controller.set('password', null);
        controller.transitionToRoute('dashboard');
      }, function (response) {
        controller.set('error', response.responseText);
      });
    }
  }
});
