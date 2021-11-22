const handler = (event, context) => {
  console.log('storageEvent Invoked')
  return 'I was invoked'
}

exports.handler = handler
