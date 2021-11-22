const childProcess = require('child_process')
const config = require('./config.json')
const path = require('path')

const root = config
  ? config.root
    ? path.join(process.cwd(), config.root)
    : process.cwd()
  : process.cwd()

const name = config
  ? config.name
    ? config.name
    : 'default storage'
  : 'default storage'

const main = () => {
  console.log(name, ': Starting Storage Interface')
  const subProcess = childProcess.spawn('npx', ['http-server', root])
  subProcess.on('error', error => {
    console.error(error)
  })

  subProcess.stdout.on('data', data => {
    // console.log(data.toString())
    process.stdout.write(data)
  })

  subProcess.stderr.on('data', data => {
    process.stderr.write(data)
  })
}

main()
