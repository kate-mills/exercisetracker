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

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
