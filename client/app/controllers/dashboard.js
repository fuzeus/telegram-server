import Ember from 'ember';

export default Ember.ArrayController.extend({
  session: Ember.inject.service('session'),

  newPostText: '',
  maxLength: 140,

  sortProperties: ['createdDate'],
  sortAscending: false,

  charLeft: function () {
    return this.get('maxLength') - this.get('newPostText.length');
  }.property('maxLength', 'newPostText'),

  overLimit: function() {
    return this.get('charLeft') < 0;
  }.property('charLeft'),

  actions: {
    createPost: function() {
      var newPostText = this.get('newPostText');
      var authenticatedUser = this.get('session.authenticatedUser');
      var post = this.store.createRecord('post', {
        body: newPostText,
        author: authenticatedUser,
        createdDate: new Date()
      });
      var controller = this;
      post.save().then(function(post) {
        controller.set('newPostText', '');
      }, function(error) {
        // TODO: show the user some error message
      });
    },

    deletePost: function(post) {
      post.destroyRecord();
    },

    repost: function(post, authenticatedUser) {
      var repost = this.store.createRecord('post', {
        body: post.get('body'),
        author: authenticatedUser,
        createdDate: new Date(),
        repost: post
      });
      repost.save();
    }
  }
});
