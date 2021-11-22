const http = require('http')

const emitEvent = (event, config) => {
  const eventBusUrl = new URL(config.eventBus.url)
  const name = config.name ? config.name : 'storage'

  const options = {
    host:
      eventBusUrl.host.indexOf(':') > 0
        ? eventBusUrl.host.substring(0, eventBusUrl.host.indexOf(':'))
        : eventBusUrl.host,
    path: eventBusUrl.path ? eventBusUrl.path : '/',
    port: parseInt(eventBusUrl.port),
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  }

  let data = ''
  const req = http.request(options, res => {
    res.on('close', () => {
      console.log(
        name,
        'event :',
        event.action,
        '-',
        event.path,
        '- response:',
        data
      )
    })
    res.on('data', chunk => (data += chunk))
    res.on('error', error => {
      console.error(error)
    })
  })
  req.on('error', error => {
    console.error(error)
  })
  req.write(JSON.stringify(event))
  req.end()
}

module.exports = emitEvent
