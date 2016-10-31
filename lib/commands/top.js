const Clapp = require('../modules/clapp-discord');
const got = require('got');
const API = 'http://127.0.0.1:8080/api/v1';

module.exports = new Clapp.Command(
  'top', // Command name
  function(argv, context, callback) {
    // This output will be redirected to your app's onReply function
    got(API + '/player', { 'json': true })
    .then(response => {
      let players = response.body.data;
      players.sort((a, b) => b.attributes['1v1'] - a.attributes['1v1']);
      let topPlayers = players.slice(0, argv.args.limit);
      let topPlayersString = topPlayers.map(player => player.attributes.name + ' - ' + player.attributes['1v1']);	
      callback(topPlayersString.join('\n'));
    })
    .catch(err => callback('Error communicating with API'));
  },
  'Returns the top SAM players', // Command description
  // Args
  [
    {
      name: 'limit',
      desc: 'The number of players to show',
      type: 'number',
      required: false,
      default: 10
    }
  ],
  [], // Flags
  true // async
  // Flags
 /* [
    {
      name: 'testflag',
      desc: 'A test flag',
      alias: 't',
      type: 'boolean',
      default: false
    }
  ]*/
);
