const requestHandler = require('./requestHandler')
const EventBus = require('./bus')

const httpInterface = require('./httpInterface')
const config = require('./config.json')

const eventBus = new EventBus(config.name)

const main = () => {
  httpInterface(config, requestHandler, eventBus)
}

main()
