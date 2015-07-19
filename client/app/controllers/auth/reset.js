import Ember from 'ember';

export default Ember.Controller.extend({
  email: '',
  message: '',
  error: '',

  actions: {
    resetPassword: function () {
      var email = this.get('email');
      var controller = this;

      var user = this.store.createRecord('user', {
        email: email,
        operation: 'resetPassword'
      });
      console.log('created user record. About to save');

      user.save().then(function(user) {
        console.log('inside callback of user.save');
        controller.set('email', null);
        controller.transitionToRoute('auth.check');
      }, function (response) {
        console.log('finished callback for user.save');
        controller.set('error', response.responseText);
      });
    }
  }
});
