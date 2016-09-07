const rpcServer = require('./app/rpc')

const host = process.env.HOST || '0.0.0.0'
const rpcPort = process.env.PORT || 1337

rpcServer.listen(rpcPort, host)

console.log('RPC TCP Server is listening on', host + ':' + rpcPort)
