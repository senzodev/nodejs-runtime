const http = require('http')

const processEvent = (event, { name, eventBusUrl }) => {
  console.log('event', event)
  const { id } = event
  const options = {
    host:
      eventBusUrl.host.indexOf(':') > 0
        ? eventBusUrl.host.substring(0, eventBusUrl.host.indexOf(':'))
        : eventBusUrl.host,
    path: eventBusUrl.path ? eventBusUrl.path : '/',
    port: parseInt(eventBusUrl.port),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }

  let data = ''
  const req = http.request(options, res => {
    res.on('close', () => {
      if (res.statusCode == 200) {
        const responseData = JSON.parse(data)
        console.log(name, ': event processed - id:', responseData.id)
      } else {
        console.warn(
          name,
          ': Clearing event from queue failed - \n\r',
          'Status Code:',
          req.statusCode,
          '\n\rBody:',
          data
        )
      }
    })
    res.on('data', chunk => (data += chunk))
    res.on('error', error => {
      console.error(name, ':', error)
    })
  })

  req.on('error', error => {
    console.error(name, ':', error)
  })
  req.write(JSON.stringify({ id }))
  req.end()
}

module.exports = processEvent
