function UserHandler() {
  this.users = [{ username: 'test', _id: '0' }]
  this.logs = []

  this.createUserLog = function(_id) {
    let { username } = this.getUser({ _id })

    if (username && !this.logs[_id]) {
      this.logs[_id] = { username, _id, log: [] }
      this.logs.unshift(this.logs[_id])
      return this.logs[_id]
    }
  }

  this.getUserLog = function({ _id = '', to = '', from = '', limit = undefined }) {
    let userLog = this.logs[_id] || this.createUserLog(_id)
    let count = parseInt(limit) || userLog.length

    let log = userLog.log.slice(0, count)

    return { ...userLog, log, count: log.length }
  }

  this.updateUserLog = function({ _id, description, duration, date }) {
    this.logs[_id] = this.getUserLog({ _id })
    if (!this.logs[_id]) {
      return false
    }

    this.logs[_id].log.push({ description, duration, date })

    return true
  }

  this.createUser = function(username) {
    username = username.trim()

    let _id = Array.from({ length: 24 }).reduce(
      (acc) => acc + Math.round(Math.random() * 10),
      ''
    )

    this.users.push({ username, _id })
    return { username, _id }
  }

  this.getUser = function({ username = '', _id = '' }) {
    return this.users.find((user) => {
      return user.username === username || user._id === _id
    })
  }

  this.getAllUsers = function() {
    return this.users
  }
}

module.exports = UserHandler
