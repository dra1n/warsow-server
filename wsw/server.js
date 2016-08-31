/* eslint no-process-env: 0 */
/* eslint no-console: 0 */

const net = require('net')
const spawn = require('child_process').spawn

const port = process.env.PORT || 1337
const host = process.env.HOST || '0.0.0.0'

const rpc = {
  'wsw-pause': 'wsw-pause',
  'wsw-resume': 'wsw-resume',
  'wsw-start': 'wsw-start',
  'wsw-stats': 'wsw-stats',
  'wsw-stop': 'wsw-stop'
}

const server = net.createServer(function (socket) {
  socket.on('data', function (data) {
    let cmd = data.toString()
    let command

    if (Object.keys(rpc).indexOf(cmd) > -1) {
      command = spawn(rpc[cmd])
      console.log('cmd: ', cmd)

      command.stdout.on('data', function (chunk) {
        socket.write(chunk.toString(), 'utf8')
        console.log(chunk.toString())
      })

      command.stderr.on('data', function (chunk) {
        socket.write(chunk.toString(), 'utf8')
        console.error(chunk.toString())
      })

      command.on('exit', function (code) {
        let message = 'child process exited with code ' + code.toString()

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
