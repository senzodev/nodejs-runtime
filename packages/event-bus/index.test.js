const childProcess = require('child_process')
const { setTimeout } = require('timers/promises')
const fetch = require('node-fetch')
const config = require('./config.json')

const spawnProcess = () => {
  return new Promise((resolve, reject) => {
    const subProcess = childProcess.spawn('node', ['packages/event-bus'])
    // subProcess.on('spawn', () => {})

    subProcess.on('error', () => {
      console.error(error)
      reject()
    })

    subProcess.stdout.on('data', data => {
      // console.log(`stdout: ${data}`)
      resolve(subProcess)
    })

    subProcess.stderr.on('data', data => {
      console.log(`stderr: ${data}`)
    })
  })
}

let sp
beforeAll(async () => {
  sp = await spawnProcess()
})

const testEvent = { name: 'Alex Smith', email: 'alex@smith.com' }

test('putEvent', async () => {
  const response = await fetch(`http://localhost:${config.port}`, {
    method: 'put',
    body: JSON.stringify(testEvent),
    headers: { 'Content-Type': 'application/json' }
  })
  const putEvent = await response.json()
  expect(putEvent.id).toBeTruthy()
  expect(putEvent.queueLength).toBeTruthy()
})

test('getEvent', async () => {
  await fetch(`http://localhost:${config.port}`, {
    method: 'put',
    body: JSON.stringify(testEvent),
    headers: { 'Content-Type': 'application/json' }
  })
  const response = await fetch(`http://localhost:${config.port}`)
  const events = await response.json()
  expect(events[0].name).toBe(testEvent.name)
})

test('processEvent', async () => {
  const putResponse = await fetch(`http://localhost:${config.port}`, {
    method: 'put',
    body: JSON.stringify(testEvent),
    headers: { 'Content-Type': 'application/json' }
  })
  const eventResponse = await putResponse.json()
  const eventId = eventResponse.id

  const response = await fetch(`http://localhost:${config.port}`, {
    method: 'post',
    body: JSON.stringify({ id: eventId }),
    headers: { 'Content-Type': 'application/json' }
  })

  const putEvent = await response.json()
  expect(putEvent.id).toBeTruthy()
})

afterAll(() => {
  sp.kill()
})
