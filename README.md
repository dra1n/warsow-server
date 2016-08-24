# Warsow server scripts

To run warsow server on your DigitalOcean account:

* Generate an [API Token]( https://cloud.digitalocean.com/settings/api/tokens)
* Export TOKEN environment variable
```bash
export TOKEN=<your token>
```
* Initialize docker machine (create droplet)
```bash
scripts/init-server
```
* Run warsow server
```bash
scripts/start-server
```

To stop warsow server simply run
```bash
scripts/stop-server
```
This will stop your docker machine and power off your droplet
