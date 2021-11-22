const http = require('http')
const path = require('path')
const fs = require('fs')

let reqComplete = false

const deleteResponse = (req, filename) => {}

const createInterface = config => {
  const port = config ? (config.port ? config.port : 5000) : 5000
  const name = config ? (config.name ? config.name : 'default') : 'default'
  const root = config
    ? config.root
      ? path.join(process.cwd(), config.root)
      : process.cwd()
    : process.cwd()

  const server = http.createServer((req, res) => {
    const filename = path.join(root, req.path)
    switch (req.method.toLowerCase()) {
      case 'put':
        const writeStream = fs.createWriteStream(filename)
        req.pipe(writeStream)

        break
      case 'get':
        const readStream = fs.createReadStream(filename)
        readStream.pipe(res)
        break
      case 'delete':
        break
    }

    req.on('end', () => {
      // const reqResponse = requestHandler(req.method, data, storageHandler)

      const contentType =
        reqResponse.status == 200
          ? { 'Content-Type': 'application/json' }
          : { 'Content-Type': 'text/html' }

      const body =
        reqResponse.status == 200
          ? JSON.stringify(reqResponse.body) + '\n\r'
          : reqResponse.body + '\n\r'

      res.writeHead(reqResponse.status, contentType)
      res.write(body)

      res.end()
    })

    req.on('err', error => {
      console.error(`${name}:`, error)
      data = ''
    })
  })

  server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
    console.error(name, ':', err)
  })
  server.on('listening', () => {
    console.log(name, ': Server Listening on port', port)
  })
  server.on('close', () => {
    console.log(name, ': Server closed')
  })
  server.listen(port)
}

module.exports = createInterface
