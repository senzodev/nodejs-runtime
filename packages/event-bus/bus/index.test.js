const EventBus = require('./index')

const testEvent = {
  someData: 'testData',
  booleanData: true,
  nestedObject: {
    nestedProperty: 'nested'
  }
}

let testEventId = ''

test('putEvent', () => {
  const eventBus = new EventBus('putEvent')
  const putResponse = eventBus.putEvent(testEvent)
  expect(putResponse).toBeTruthy()
  expect(putResponse.queueLength).toBe(1)
})

test('getEvents', () => {
  const eventBus = new EventBus('getEvent')
  const putResponse = eventBus.putEvent(testEvent)
  testEventId = putResponse.id
  const getResponse = eventBus.getEvents()
  expect(getResponse[0].id).toBe(testEventId)
  expect(getResponse[0].meta.attempt).toBe(1)
})

test('processEvent', () => {
  const eventBus = new EventBus('getEvent')
  const putResponse = eventBus.putEvent(testEvent)
  testEventId = putResponse.id
  const processResponse = eventBus.processEvent(testEventId)
  expect(processResponse.id).toBe(testEventId)
})
