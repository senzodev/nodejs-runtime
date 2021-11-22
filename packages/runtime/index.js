const { join } = require('path')
const functionManifest = require('./functionManifest.json')

const invokeFunction = async (event, context, config) => {
  let response = {
    error: 'Invocation failed for unknown reason'
  }
  try {
    console.time(`runtime : ${functionConfig.name} invocation ${event.id}`)

    const { path, main, handler } = config
    const functionPath = join(process.cwd(), path, main)
    const functionModule = require(functionPath)
    const functionResponse = await functionModule[handler](event, context)
    response = {
      id: event.id,
      context,
      functionResponse
    }

    console.timeEnd(`runtime : ${functionConfig.name} : invocation ${event.id}`)
  } catch (error) {
    console.error('runtime :', functionConfig.name, ' : Error', error)
    response = {
      error
    }
  }
  return response
}

const runtime = async (event, context) => {
  console.log(
    'runtime invoked',
    event,
    '\n\r',
    context,
    '\n\r',
    functionManifest
  )

  let functionConfig = false
  if (Array.isArray(event)) {
  } else {
    const { source } = event

    const functionConfig = functionManifest[source]
    console.log(functionConfig)
  }
  if (!functionConfig) throw new Error('Unable to find function configuration')

  return invokeFunction(event, context, functionConfig)
}

module.exports = runtime
