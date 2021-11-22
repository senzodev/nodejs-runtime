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
  watcher.on('add', (filePath, stats) => {
    if (startProcessing) {
      emitEvent(
        { source: 'storage', action: 'add', path: filePath, stats },
        config
      )
    }
  })
  watcher.on('change', (filePath, stats) =>
    emitEvent(
      { source: 'storage', action: 'change', path: filePath, stats },
      config
    )
  )
  watcher.on('unlink', (filePath, stats) =>
    emitEvent(
      { source: 'storage', action: 'unlink', path: filePath, stats },
      config
    )
  )

  watcher.on('error', error => console.error(name, ':', error))
}

main()
