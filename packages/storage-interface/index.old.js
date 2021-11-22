const config = require('./config.json')
const path = require('path')
const chokidar = require('chokidar')
const emitEvent = require('./emitEvent')
const { setTimeout } = require('timers')

let startProcessing = false

setTimeout(() => {
  startProcessing = true
  console.log(config.name, ': Ready to start processing events')
}, 1000)

const name = config
  ? config.name
    ? config.name
    : 'default storage event'
  : 'default storage event'

const watchPath = config
  ? config.watchPath
    ? path.join(process.cwd(), config.watchPath)
    : path.join(process.cwd(), './bucket')
  : path.join(process.cwd(), './bucket')

const main = () => {
  const watchOptions = {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    followSymlinks: false
  }
  const watcher = chokidar.watch(watchPath, watchOptions)

  watcher.on('ready', () => console.log(name, `: Watching folder ${watchPath}`))
  watcher.on('add', (path, stats) => {
    if (startProcessing) {
      emitEvent({ action: 'add', path, stats }, config)
    }
  })
  watcher.on('change', (path, stats) =>
    emitEvent({ action: 'change', path, stats }, config)
  )
  watcher.on('unlink', (path, stats) =>
    emitEvent({ actions: 'unlink', path, stats }, config)
  )

  watcher.on('error', error => console.error(name, ':', error))
}

main()
