const path = require('path')
const runtime = require('../runtime')
const ulid = require('ulid')

const newWorker = async event => {
  const context = {
    id: ulid.ulid(),
    timestamp: Date.now()
  }
  return runtime(event, context)
}

const requestHandler = async (name, event) => {
  let response = {
    status: 500,
    body: {
      error: 'Invocation failed',
      event
    }
  }
  try {
    const invocationResponse = await newWorker(event)
    console.log(invocationResponse)
    if (!invocationResponse) throw new Error('Unexpected Response from runtime')

    if (invocationResponse.error) throw new Error(invocationResponse.error)

    const events = event.map(item => {
      return { id: item.id }
    })
    response = {
      status: 200,
      body: events
    }
  } catch (error) {
    console.error(name, ': Invocation Failed \n\r', error)
  }
  return response
}

module.exports = requestHandler
