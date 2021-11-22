const fs = require('fs')
const path = require('path')
class storage {
  constructor (config) {
    this.name = config.name
    const rootPath = path.join(process.cwd(), config.root)
    this.root = rootPath
  }

  put (filename, incomingStream) {
    const dest = path.join(this.root, filename)
    const writeStream = fs.createWriteStream(dest)
    incomingStream.pipe(writeStream)
  }

  get (filename, outputStream) {
    const source = path.join(this.root, filename)
    const readStream = fs.createReadStream(source)
    outputStream.pipe(readStream)
  }

  delete (filename, callback) {
    const target = path.join(this.root, filename)
    fs.unlink(target, callback)
  }
}

module.exports = storage
