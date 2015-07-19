import Ember from 'ember';

/* global md5 */

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  name: '',
  username: '',
  password: '',
  email: '',
  error: null,

  actions: {
    signup: function() {
      var name = this.get('name');
      var username = this.get('username');
      var password = this.get('password');
      var email = this.get('email');
      var controller = this;

      if (Ember.isEmpty(name)) {
        return this.set('error', 'Please enter name');
      }

      if (Ember.isEmpty(email)) {
        return this.set('error', 'Please enter email');
      }

      if (Ember.isEmpty(username)) {
        return this.set('error', 'Please enter username');
      }

      if (Ember.isEmpty(password)) {
        return this.set('error', 'Please enter password');
      }

      var user = this.store.createRecord('user', {
        id: username,
        name: name,
        email: email,
        password: md5( username + password),
        operation: 'signup'
      });

      user.save().then(function(user) {
        controller.get('session').set('authenticatedUser', user);
        controller.set('name', null);
        controller.set('username', null);
        controller.set('password', null);
        controller.set('email', null);
        controller.transitionToRoute('dashboard');
      }, function (response) {
        controller.set('error', response.responseText);
      });
    }
  }
});
