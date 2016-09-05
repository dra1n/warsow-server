/* eslint no-process-env: 0 */
/* eslint no-console: 0 */

const net = require('net')
const spawn = require('child_process').spawn

const port = process.env.PORT || 1337
const host = process.env.HOST || '0.0.0.0'

const rpc = {
  pause: 'game-pause',
  resume: 'game-resume',
  start: 'game-start',
  stats: 'game-stats',
  stop: 'game-stop'
}

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
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

  socket.on('error', function (message) {
    console.error(message)
  })
})

server.listen(port, host)

console.log('TCP Server is listening on', host + ':' + port)
