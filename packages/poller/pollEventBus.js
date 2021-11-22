const http = require('http')
const postInvoke = require('./invokeFunction')

const pollEventBus = ({ name, eventBusUrl, invokeUrl }) => {
  const pollSourceOptions = {
    host:
      eventBusUrl.host.indexOf(':') > 0
        ? eventBusUrl.host.substring(0, eventBusUrl.host.indexOf(':'))
        : eventBusUrl.host,
    path: eventBusUrl.path ? eventBusUrl.path : '/',
    port: parseInt(eventBusUrl.port),
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }

  const getRequest = http.request(pollSourceOptions, getResponse => {
    // console.log(name, 'event polled')

    if (getResponse.statusCode == 200) {
      let getData = ''
      getResponse.on('data', chunk => {
        getData += chunk
      })

      getResponse.on('error', error => {
        console.error(
          name,
          ': Unable to poll event bus',
          config.eventBus.url,
          '\n\r',
          error
        )
        process = false
      })

      getResponse.on('close', () => {
        const dataJson = JSON.parse(getData)
        if (dataJson.length > 0) {
          postInvoke(getData, { name, invokeUrl, eventBusUrl })
        }
      })
    }
  })

  getRequest.end()
}

module.exports = pollEventBus
