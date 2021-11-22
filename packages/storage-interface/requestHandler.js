const isJSON = jsonString => {
  let response = false
  try {
    response = JSON.parse(jsonString)
  } catch (error) {
    response = false
  }
  return response
}

const getHandler = eventBus => {
  const body = eventBus.getEvents()
  return { status: 200, body }
}

const putHandler = (storageHandler, data) => {
  let response = { status: 400 }
  const jsonData = isJSON(data)
  if (jsonData) {
    const body = eventBus.putEvent(jsonData)
    response = { status: 200, body }
  } else {
    response = { status: 400, body: 'JSON data expected' }
  }
  return response
}

const postHandler = (eventBus, data) => {
  let response = { status: 400 }
  const jsonData = isJSON(data)
  if (jsonData) {
    const body = eventBus.processEvent(jsonData.id)
    if (body) {
      response = { status: 200, body }
    } else {
      response = { status: 404, body: 'Event not found' }
    }
  } else {
    response = { status: 400, body: 'JSON data expected' }
  }
  return response
}

const requestHandler = (method, data, eventBus) => {
  let response = false
  try {
    switch (method.toLowerCase()) {
      case 'put':
        response = putHandler(eventBus, data)
        break
      case 'get':
        response = getHandler(eventBus)
        break
      case 'post':
        response = postHandler(eventBus, data)
        break
    }
  } catch (error) {
    console.error(error)
    response = { status: 501, body: error }
  }

  return response
}

module.exports = requestHandler
