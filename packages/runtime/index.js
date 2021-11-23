import { join } from 'path'
import { readFileSync } from 'fs'

const functionManifest = JSON.parse(
  readFileSync(join(process.cwd(), './packages/runtime/functionManifest.json'))
)

const invokeFunction = async (event, context, config) => {
  let response = {
    error: 'Invocation failed for unknown reason'
  }

  try {
    const { path, main, handler } = config
    const functionPath = join(process.cwd(), path, main)

    const functionModule = await import(functionPath)
    const functionResponse = await functionModule[handler](event, context)
    response = {
      id: event.id,
      context,
      functionResponse
    }
  } catch (error) {
    console.error('runtime :', config.name, ' : Error', error)
    response = {
      error
    }
  }
  return response
}

const runtime = async (event, context) => {
  /*
  console.log(
    'runtime invoked',
    event,
    '\n\r',
    context,
    '\n\r',
    functionManifest
  )
*/
  let functionConfig = false
  let invokeResponseArray = []

  if (Array.isArray(event)) {
    await Promise.all(
      event.map(async item => {
        const { source } = item

        functionConfig = functionManifest[source]
        let response = {}
        if (typeof functionConfig == 'object') {
          response = await invokeFunction(item, context, functionConfig)
        }
        return response
      })
    )
  } else {
    const { source } = event

    functionConfig = functionManifest[source]

    const response = await invokeFunction(event, context, functionConfig)
    invokeResponseArray.push(response)
  }
  if (!functionConfig) throw new Error('Unable to find function configuration')

  return invokeResponseArray
}

export default runtime
