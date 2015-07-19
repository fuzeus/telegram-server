import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('auth', { path: '/'}, function() {
    this.route('signup', {path: '/'});
    this.route('login');
    this.route('reset');
    this.route('check');
  });

  this.route('dashboard');

  this.route('user', { path: '/:user_id'}, function() {
    this.route('posts', {path: '/'});
    this.route('following');
    this.route('followers');
  });
});

export default Router;
