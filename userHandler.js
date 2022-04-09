function UserHandler() {
  this.users = [{ username: 'test', _id: '0' }]

  this.createUser = function (username) {
    username = username.trim()

    let _id = Array.from({ length: 24 }).reduce(
      (acc) => acc + Math.round(Math.random() * 10),
      ''
    )

    this.users.push({ username, _id })
    return { username, _id }
  }

  this.getUser = function ({ username = '', _id = '' }) {
    return this.users.find((user) => {
      return user.username === username || user._id === _id
    })
  }

  this.getAllUsers = function () {
    return this.users
  }
}

module.exports = UserHandler
