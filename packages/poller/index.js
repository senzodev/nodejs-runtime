const config = require('./config.json')
const handleEvent = require('./handleEvent.js')
let startProcessing = false

const main = ({ name, eventBusUrlString, invokeUrlString, frequency }) => {
  console.log(
    name,
    ': polling for events at ',
    eventBusUrlString,
    'and forwarding to',
    invokeUrlString
  )
  const eventBusUrl = new URL(eventBusUrlString)
  const invokeUrl = new URL(invokeUrlString)
  setInterval(() => {
    if (startProcessing) {
      handleEvent({ name, eventBusUrl, invokeUrl })
    }
  }, frequency)
}

const name = config.name ? config.name : 'poller'
const eventBusUrlString = config.eventBus.url
  ? config.eventBus.url
  : 'http://localhost:5000'
const invokeUrlString = config.invoker.url
  ? config.invoker.url
  : 'http://localhost:6000'
const frequency = config.frequency ? config.frequency : 100

setTimeout(() => {
  startProcessing = true
  console.log(name, ': Ready to start polling for events')
}, 1000)

main({ name, eventBusUrlString, invokeUrlString, frequency })
