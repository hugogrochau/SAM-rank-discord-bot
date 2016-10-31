const Clapp = require('../modules/clapp-discord');
const got = require('got');
const API = 'http://192.241.250.100:8080/api/v1';
const playlists = ['1v1', '2v2', '3v3', '3v3s', 'sum'];

module.exports = new Clapp.Command(
  'top', // Command name
  function(argv, context, callback) {
    // This output will be redirected to your app's onReply function
    if (argv.args.limit >= 1 && argv.args.limit <= 100) {
      got(API + '/player', { 'json': true })
      .then(response => {
        let players = response.body.data;
        if (playlists.includes(argv.args.playlist)) {
          if (argv.args.playlist == 'sum') {
            players.forEach(player => player.attributes.sum = player.attributes['1v1'] + player.attributes['2v2'] + player.attributes['3v3'] + player.attributes['3v3s']);
          }

          players.sort((a, b) => b.attributes[argv.args.playlist] - a.attributes[argv.args.playlist]);
          let topPlayers = players.slice(0, argv.args.limit);
          let topPlayersString = topPlayers.map((player, i, arr) => '#' + (i + 1) + ' - ' + player.attributes.name + ' - ' + player.attributes[argv.args.playlist]);
          callback('**South American ' + argv.args.playlist + ' ranking:**\n\n' + topPlayersString.join('\n'));
        } else {
          callback('Playlist needs to be one of: ' + playlists.join(', '));
        }
      })
      .catch(err => callback('Error communicating with the API'));
    } else {
      callback('Limit needs to bet between 1 and 100');
    }
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
    },
    {
      name: 'playlist',
      desc: '1v1, 2v2, 3v3, 3v3s or sum',
      type: 'string',
      required: false,
      default: 'sum'
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
