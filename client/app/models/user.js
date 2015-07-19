import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  photo: DS.attr('string'),
  followedByAuthenticatedUser: DS.attr('boolean')
}).reopenClass({
  FIXTURES: [
    {
      id: 'joeschmidt',
      name: 'Joe Schmidt',
      email: 'joeschmidt@schmidt.com'
    },
    {
      id: 'carollovell',
      name: 'Carol Lovell',
      email: 'carol@lovelegos.com'
    },
    {
      id: 'krysrutledge',
      name: 'Krys Rutledge',
      email: 'krys@hulkitup.com'
    }
  ]
});
