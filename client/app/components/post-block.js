import Ember from 'ember';

export default Ember.Component.extend({
  showRepostBox: false,

  ownPost: function() {
    return this.get('authenticatedUser.id') === this.get('post.author.id');
  }.property('authenticatedUser', 'post'),

  actions: {
    showConfirmation: function() {
      this.toggleProperty('showRepostBox');
    },

    sendDelete: function() {
      this.sendAction('delete', this.get('post'));
    },

    sendRepost: function() {
      this.sendAction('createRepost', this.get('post'), this.get('authenticatedUser'));
      this.toggleProperty('showRepostBox');
    },

    cancel: function() {
      this.toggleProperty('showRepostBox');
    }
  }
});
