# Warsow server scripts

To run warsow server on your DigitalOcean account:

* Generate an [API Token]( https://cloud.digitalocean.com/settings/api/tokens)
* Export TOKEN environment variable
```bash
export TOKEN=<your token>
```
* Initialize docker machine (create droplet) and run warsow server
```bash
scripts/wsw-start
```

To stop warsow server simply run
```bash
scripts/wsw-stop
```
This will stop your docker machine and destroy droplet

To run this inside container
```bash
docker build -t boom/wsw-scripts .
docker run -e TOKEN=<digitalocean token> -e PORT=1337 -e HOST='0.0.0.0' -p 1337:1337 -t boom/wsw-scripts
# TCP Server is listening on 0.0.0.0:1337
```

You can use tcp client to invoke wsw scripts. For example

```
var net = require('net')
var client = new net.Socket()

client.connect(1337, '0.0.0.0', function() {
  console.log('Connected')
  client.write('wsw-start')
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
  client.write('wsw-stop')
})
```
