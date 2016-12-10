# Warsow server scripts

### To run warsow server on your DigitalOcean account:

* Generate an [API Token]( https://cloud.digitalocean.com/settings/api/tokens)
* Export TOKEN environment variable
```bash
export TOKEN=<your token>
```
* Initialize docker machine (create droplet) and run warsow server
```bash
scripts/game-start
```

To stop warsow server simply run
```bash
scripts/game-stop
```
This will stop your docker machine and destroy droplet

### To run this inside container
```bash
docker build -t boom/wsw-scripts .
docker run -e TOKEN=<digitalocean token> -e RPC_PORT=1337 -e PTY_PORT=8007 -e HOST='0.0.0.0' -p 1337:1337 -p 8007:8007 -t --rm -i dra1n/wsw-scripts
# RPC TCP Server is listening on 0.0.0.0:1337
# PTY TCP Server is listening on 0.0.0.0:8007
```

You can use tcp client to invoke wsw scripts. For example

```
var net = require('net')
var client = new net.Socket()

client.connect(1337, '0.0.0.0', function() {
  console.log('Connected')
  client.write(JSON.stringify({
    cmd: 'start'
  }))
})

client.on('data', function(data) {
  console.log(data.toString())
})

client.on('close', function() {
  console.log('Connection closed')
})

//  About to remove Warsow
//
//  Error removing host "Warsow": Host does not exist: "Warsow"
//  Can't remove "Warsow"
//
//  Creating CA: /root/.docker/machine/certs/ca.pem
//
//  Creating client certificate: /root/.docker/machine/certs/cert.pem
//  ...
```

After command invoke connection will be closed. To run another command
reestablish the connection

```
client.connect(1337, '0.0.0.0', function() {
  console.log('Connected')
  client.write(JSON.stringify({
    cmd: 'stop'
  }))
})

//  Successfully removed Warsow
```
