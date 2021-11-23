const handler = async (event, context) => {
  console.log('storage function: \n\r', event, '\n\r', context)
  return 'I was invoked'
}

exports.handler = handler
