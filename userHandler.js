function UserHandler() {
  this.db = []

  this.createUser = function (username) {
    username = username.trim()

    let _id = Array.from({ length: 24 }).reduce(
      (acc) => acc + Math.round(Math.random() * 10),
      ''
    )

    this.db.push({ username, _id })
    return { username, _id }
  }

  this.getUserByUsername = function (username) {
    return this.db.find((user) => {
      return user.username === username.trim()
    })
  }
}

module.exports = UserHandler
