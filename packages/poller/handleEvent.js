const pollEventBus = require('./pollEventBus')

const handleEvent = config => {
  pollEventBus(config)
}

module.exports = handleEvent
