const config = require('./config.json')
const httpInterface = require('./httpInterface')
const requestHandler = require('./requestHandler')

const main = () => {
  httpInterface(config, requestHandler)
}

main()
