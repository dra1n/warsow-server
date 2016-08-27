/* eslint no-process-env: "allow" */

const net = require('net')
const spawn = require('child_process').spawn

const port = process.env.PORT || 1337
const host = process.env.HOST || '0.0.0.0'

var rpc = {
  'wsw-pause': 'wsw-pause',
  'wsw-resume': 'wsw-resume',
  'wsw-start': 'wsw-start',
  'wsw-stats': 'wsw-stats',
  'wsw-stop': 'wsw-stop'
}

var server = net.createServer(function(socket) {
  socket.on('data', function (data) {
    var cmd = data.toString()
    var command

    if (Object.keys(rpc).indexOf(cmd) > -1) {
      command = spawn(rpc[cmd])
      console.log('cmd: ', cmd)

      command.stdout.on('data', function (data) {
        socket.write(data.toString(), 'utf8')
        console.log(data.toString())
      })

      command.stderr.on('data', function (data) {
        socket.write(data.toString(), 'utf8')
        console.error(data.toString())
      })

      command.on('exit', function (code) {
        var message = 'child process exited with code ' + code.toString()
        if (code !== 0) {
          socket.destroy(new Error(message))
        } else {
          socket.end()
        }
        console.log(message)
      })
    }
  })
})

server.listen(port, host)

console.log('TCP Server is listening on', host + ':' + port)
