const handler = require('./index.js')

test('Is invoked', () => {
  const event = { name: 'Alex' }
  const response = handler.handler(event)
  expect(response).toBe('I was invoked')
})
