const runtime = require('../runtime/')
const ulid = require('ulid')
/*
const { parentPort, workerData, isMainThread } = require('worker_threads')
const ulid = require('ulid')

if (!isMainThread) {
  if (workerData) {
    const context = {
      id: ulid.ulid(),
      timestamp: Date.now()
    }
    const { event } = workerData

    runtime(event, context, parentPort.postMessage)
  }
}
*/

const { runAsWorker } = require('sync-threads')

runAsWorker(() => {
  console.log('invoke runtime')
  const context = {
    id: ulid.ulid(),
    timestamp: Date.now()
  }

  const response = runtime(context)
  return response
})
