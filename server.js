const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))

//app.use(bodyParser.json());
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

app.post('/api/users/:_id/exercises', addUserToRequest, (req, res) => {
  let { description, duration } = req.body

  let date = req.body.date
    ? new Date(req.body.date).toUTCString()
    : new Date(Date.now()).toUTCString()

  let [day, dt, mo, year] = date.split(' ')

  let exercise = {
    date: `${day.slice(day.length)} ${mo} ${dt} ${year}`,
    description,
    duration: parseInt(duration),
  }

  return req.user ? res.json({ ...req.user, ...exercise }) : res.json({})
})

function addUserToRequest(req, res, next) {
  let { body } = req

  if (body[':_id']) {
    req.user = uHandler.getUser({ _id: body[':_id'] })
  }

  next()
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
