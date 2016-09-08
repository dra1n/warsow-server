/* eslint no-process-env: 0 */
/* eslint no-console: 0 */

const rpcServer = require('./app/rpc')
const ptyServer = require('./app/pty').ptyServer

const host = process.env.HOST || '0.0.0.0'
const rpcPort = process.env.RPC_PORT || 1337
const ptyPort = process.env.PTY_PORT || 8007

rpcServer.listen(rpcPort, host)
ptyServer.listen(ptyPort, host)

console.log('RPC TCP Server is listening on', host + ':' + rpcPort)
console.log('PTY TCP Server is listening on', host + ':' + ptyPort)
