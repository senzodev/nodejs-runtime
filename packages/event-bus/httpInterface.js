const http = require('http')

const createInterface = (config, requestHandler, eventBus) => {
  const port = config ? (config.port ? config.port : 5000) : 5000
  const name = config ? (config.name ? config.name : 'default') : 'default'

  const server = http.createServer((req, res) => {
    let data = ''
    req.on('data', chunk => {
      data += chunk
    })

    req.on('end', () => {
      const reqResponse = requestHandler(req.method, data, eventBus)

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
