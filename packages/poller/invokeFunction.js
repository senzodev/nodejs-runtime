const http = require('http')
const eventProcessed = require('./eventProcessed')

const invokeFunction = (event, { name, invokeUrl, eventBusUrl }) => {
  const invokeDestOptions = {
    host:
      invokeUrl.host.indexOf(':') > 0
        ? invokeUrl.host.substring(0, invokeUrl.host.indexOf(':'))
        : invokeUrl.host,
    path: invokeUrl.path ? invokeUrl.path : '/',
    port: parseInt(invokeUrl.port),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }

  const postRequest = http.request(invokeDestOptions, postResponse => {
    let postData = ''
    postResponse.on('error', error => {
      console.error(
        name,
        ': Unable to invoke service',
        invokeUrl.host,
        '\n\r',
        error
      )
      process = false
    })

    postResponse.on('data', chunk => {
      postData += chunk
    })

    postResponse.on('close', async () => {
      if (process) {
        console.log(postData)
        const dataJson = JSON.parse(postData)

        dataJson.map(async event => {
          return eventProcessed(event, { name, eventBusUrl })
        })
      }
    })
  })

  postRequest.write(event)
  postRequest.end()
}

module.exports = invokeFunction
