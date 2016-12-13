/* eslint no-process-env: 0 */
/* eslint no-console: 0 */

const net = require('net')
const pty = require('pty.js')

let terminal
let logs

const createTerminal = (cmdOptions, socket) => {
  const { cmd, cols, rows } = cmdOptions

  if (terminal) {
    return
  }

  terminal = pty.spawn(cmd, [], {
    name: 'xterm-color',
    cols: parseInt(cols || 80, 10),
    rows: parseInt(rows || 24, 10),
    cwd: process.env.PWD,
    env: process.env
  })

  console.log('Created terminal with PID: ' + terminal.pid)

  logs = ''

  terminal.on('data', (data) => {
    logs = logs + data
  })

  socket.write(terminal.pid.toString())
  socket.end()
}

const ptyServer = net.createServer((socket) => {
  console.log('Connected to terminal ' + terminal.pid)

  socket.write(logs)

  terminal.on('data', (data) => {
    try {
      socket.write(data)
    } catch (e) {
      // client socket is not open, ignore
      console.log(e.message)
    }
  })

  socket.on('data', (data) => {
    try {
      terminal.write(data)
    } catch(e) {
      console.log(e.message)
      console.log('Terminal does not exists')
    }
  })

  socket.on('close', () => {
    try {
      process.kill(terminal.pid)
      console.log('Closed terminal ' + terminal.pid)
    } catch(e) {
      console.log(e.message)
      console.log('Was already killed ')
    }

    terminal = null
    logs = ''
  })
})

module.exports.createTerminal = createTerminal
module.exports.ptyServer = ptyServer
