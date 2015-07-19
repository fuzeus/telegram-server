import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    sendFollow: function () {
      this.sendAction('follow', this.get('user'));
    }
  }
});
