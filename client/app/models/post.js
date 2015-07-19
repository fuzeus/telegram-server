import DS from 'ember-data';

export default DS.Model.extend({
  body: DS.attr('string'),
  createdDate: DS.attr('date'),
  author: DS.belongsTo('user', {async: true}),
  repost: DS.belongsTo('post', {async: true, inverse: null})
}).reopenClass({
  FIXTURES: [
    {
      id: 1,
      body: 'This is literally the coolest post ever!',
      createdDate: new Date(),
      author: 'joeschmidt'
    },
    {
      id: 2,
      body: 'This is literally the coolest post ever!',
      createdDate: new Date(),
      author: 'carollovell'
    },
    {
      id: 3,
      body: 'This is literally the coolest post ever!',
      createdDate: new Date(),
      author: 'krysrutledge'
    }
  ]
});
