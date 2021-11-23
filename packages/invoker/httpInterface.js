import http from 'http'

const createInterface = (config, requestHandler) => {
  const port = config ? (config.port ? config.port : 6000) : 6000
  const name = config ? (config.name ? config.name : 'invoker') : 'invoker'

  const server = http.createServer((req, res) => {
    let data = ''
    req.on('data', chunk => {
      data += chunk
    })

    req.on('end', async () => {
      let reqResponse = {
        status: 500,
        body: {
          error: 'Invocation Failed'
        }
      }
      if (req.method.toLowerCase() == 'post') {
        reqResponse = await requestHandler(name, JSON.parse(data))
      }

      const contentType = { 'Content-Type': 'application/json' }

      const body = JSON.stringify(reqResponse.body) + '\n\r'

      res.writeHead(reqResponse.status, contentType)
      res.write(body)

      res.end()
    })

    req.on('err', error => {
      console.error(name, ':', error)
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

export default createInterface
