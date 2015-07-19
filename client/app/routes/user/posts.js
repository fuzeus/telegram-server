import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var currentUser = this.modelFor('user');
    return this.store.find("post", {author: currentUser.get("id")});
  }
});
