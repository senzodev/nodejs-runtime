const childProcess = require('child_process')

const config = require('./config.json')

const spawnProcess = item => {
  const subProcess = childProcess.spawn('node', [item])
  // subProcess.on('spawn', () => {})

  subProcess.on('error', () => {
    console.error(error)
  })

  subProcess.stdout.on('data', data => {
    // console.log(data.toString())
    process.stdout.write(data)
  })

  subProcess.stderr.on('data', data => {
    console.log(`subprocess error: ${data}`)
  })
}

const main = () => {
  config.map(item => {
    spawnProcess(item)
  })
}

main()
