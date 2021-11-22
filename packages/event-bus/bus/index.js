const ULID = require('ulid')

class eventBus {
  constructor (name) {
    this.bus = new Array()
    this.name = name
  }

  putEvent (event) {
    let returnStatus = false
    event.id = ULID.ulid()
    event.meta = {
      eventTime: Date.now(),
      retryTime: Date.now(),
      attempt: 0
    }
    this.bus.push(event)
    returnStatus = {
      id: event.id,
      queueLength: this.bus.length
    }
    return returnStatus
  }

  getEvents () {
    const processTime = Date.now()
    let returnEvent = []

    for (let i = 0; i < this.bus.length; i++) {
      const event = this.bus[i]

      if (event.meta) {
        if (event.meta.retryTime) {
          if (event.meta.retryTime <= processTime) {
            event.meta.attempt++

            switch (event.meta.attempt) {
              case 0:
                break
              case 1:
                event.meta.retryTime = Date.now() + 5000
                break
              case 2:
                event.meta.retryTime = Date.now() + 30000
                break
              case 3:
                event.meta.retryTime = Date.now() + 180000
                break
              default:
                console.log(
                  `${this.name}:`,
                  'Event delivery failed 3 times. Event detail: \n\r',
                  JSON.stringify(event, null, 2)
                )
                this.bus.splice(i, 1)
            }
            returnEvent.push(JSON.parse(JSON.stringify(event)))
          }
        }
      }
    }
    return returnEvent
  }

  processEvent (eventId) {
    let returnStatus = false
    for (let i = 0; i < this.bus.length; i++) {
      const event = this.bus[i]

      if (event.meta) {
        if (event.id == eventId) {
          this.bus.splice(i, 1)
          i = this.bus.length
          returnStatus = { id: eventId }
        }
      }
    }
    return returnStatus
  }

  queueLength () {
    return this.bus.length
  }
}

module.exports = eventBus
