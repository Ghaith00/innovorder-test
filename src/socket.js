const WebSocket  = require('ws');
const getOldDate = require('./controllers/order').getOldDate;
const config     = require('./config');
/**
 * Preapare a simple web socket
 * https://github.com/websockets/ws
 */
const wss = new WebSocket.Server({ port : config.wsPort });
/**
 * Broadcast to everyone else the next available ordering date
 */
const sendToAll = (data)=>{
  wss.clients.forEach( (client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}
/**
 * This is for testing
 */
 wss.on('connection', (ws, request) => {
   // You might use location.query.access_token to authenticate or share sessions
   // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
   ws.on('message', (message) => {
     console.log('[.] received: %s', message);
   });
 });

module.exports = { wss, sendToAll };
