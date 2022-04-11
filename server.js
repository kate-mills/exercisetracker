const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

const UserHandler = require('./userHandler.js')

let uHandler = new UserHandler()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.post('/api/users', (req, res) => {
  let { username } = req.body

  if (!username) {
    return res.json({ error: 'username is required' })
  }

  let current = uHandler.getUser({ username })
  return !current ? res.json(uHandler.createUser(username)) : res.json(current)
})

app.get('/api/users', (req, res) => {
  return res.json(uHandler.getAllUsers())
})

app.post(
  '/api/users/:_id/exercises',
  addUserToRequest,
  validateExerciseFields,
  (req, res) => {
    let {
      error,
      body: { description, duration },
    } = req

    if (req.user.error) {
      return res.json(req.user)
    }

    if (error) {
      return res.json(error)
    }
    this.logs

    let date = req.body.date
      ? new Date(req.body.date).toUTCString()
      : new Date(Date.now()).toUTCString()

    let [day, dt, mo, year] = date.split(' ')
    date = `${day.slice(0, day.length - 1)} ${mo} ${dt} ${year}`

    let log = { ...req.user, description, duration: parseInt(duration), date }

    return !!uHandler.updateUserLog(log)
      ? res.json(log)
      : res.json({ error: 'error updating exercise log.' })
  }
)

app.get('/api/users/:_id/logs', parseQueryString, (req, res) => {
  let { error, query } = req
  if (error) {
    return res.json(error)
  }
  let { to, from, limit } = query

  let userLog = uHandler.getUserLog({ _id: req.params._id, to, from, limit })

  return res.json(uHandler.getUserLog({ _id: req.params._id, to, from, limit }))
})

function parseQueryString(req, res, next) {
  let { from, to, limit } = req.query

  let formatError = (msg) => `Validation failed: ${msg}`

  if (!!from && new Date(from) == 'Invalid Date') {
    req.error = { ValidationError: formatError('FROM (is not a date)') }
    next()
  }
  if (!!to && new Date(to) == 'Invalid Date') {
    req.error = { ValidationError: formatError('TO (is not a date)') }
    next()
  }
  if (limit && !parseFloat(limit)) {
    req.error = { ValidationError: formatError('LIMIT (is not a number)') }
    next()
  }
  next()
}

function validateExerciseFields(req, res, next) {
  let { description, duration, date } = req.body

  if (!description.length) {
    req.error = {
      ValidationError: `Validation failed: description is required`,
    }
    next() // error found so move on
  }
  if (!duration) {
    req.error = { ValidationError: `Validation failed: duration is required` }
    next() // error found so move on
  }
  if (!parseFloat(duration)) {
    req.error = {
      ValidationError: `Validation failed: duration is not a number`,
    }
    next() // error found so move on
  }
  if (!!date && new Date(date) == 'Invalid Date') {
    req.error = { ValidationError: `Validation failed: invalid date` }
    next() // error found so move on
  }
  next()
}

function addUserToRequest(req, res, next) {
  let {
    params: { _id },
  } = req
  req.user = uHandler.getUser({ _id }) || { error: `user not found` }

  next()
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
