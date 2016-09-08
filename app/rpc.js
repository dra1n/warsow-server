/* eslint no-console: 0 */
/* eslint consistent-return: 0 */

const net = require('net')
const spawn = require('child_process').spawn
const createTerminal = require('./pty').createTerminal
const commands = require('./commands')

const toCmd = (buff) => {
  let cmd = {}
  let cmdString = buff.toString()

  try{
    cmd = JSON.parse(cmdString)
  } catch(e) {
    console.error('Invalid command: ', cmdString)
  }

  return cmd
}

const rpcServer = net.createServer((socket) => {
  socket.on('data', (data) => {
    const cmdOptions = toCmd(data)
    const { cmd, pty } = cmdOptions
    let command

    if (Object.keys(commands).indexOf(cmd) < 0) {
      return
    }

    if (pty) {
      return createTerminal(cmdOptions, socket)
    }

    console.log('cmd: ', cmd)

    command = spawn(commands[cmd])

    command.stdout.on('data', (chunk) => {
      socket.write(chunk.toString(), 'utf8')
      console.log(chunk.toString())
    })

    command.stderr.on('data', (chunk) => {
      socket.write(chunk.toString(), 'utf8')
      console.error(chunk.toString())
    })

    command.on('exit', (code) => {
      let message = 'child process exited with code ' + code.toString()

      if (code !== 0) {
        socket.destroy(new Error(message))
      } else {
        socket.end()
      }
      console.log(message)
    })
  })

  socket.on('error', (message) => {
    console.error(message)
  })
})

module.exports = rpcServer
