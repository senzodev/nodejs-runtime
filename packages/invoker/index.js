import httpInterface from './httpInterface.js'
import requestHandler from './requestHandler.js'
import { readFileSync } from 'fs'
import { join } from 'path'
const config = JSON.parse(
  readFileSync(join(process.cwd(), './packages/invoker/config.json'))
)

const main = () => {
  httpInterface(config, requestHandler)
}

main()
