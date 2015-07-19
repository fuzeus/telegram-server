import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    sendLogOut: function() {
      this.sendAction('loggingOut', this.get('authenticatedUser'));
    }
  }
});
