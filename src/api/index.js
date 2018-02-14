const uuidv4 = require('uuid/v4')

const USERS = {
  peter: {password: '123', name: 'peter'}
}

const api = {
  handleLogin: (req, res) => {
    if (USERS[req.body.username] && USERS[req.body.username].password === req.body.password) {
      if (!USERS[req.body.username].token) {
        USERS[req.body.username].token = uuidv4()
      }
      res.set('Set-Cookie', `token=${USERS[req.body.username].token}; Expires='Wed, 21 Oct 2020 07:28:00 GMT'; Path=/`)
      return res.status(200).end()
    }

    return res.status(404).end()
  },

  handleGetUser: (req, res) => {
    const user = api.getUserByToken(req.params.token)
    return user ? res.send(user) : res.status(404).end()
  },

  getUserByToken: token => {
    let user

    Object.keys(USERS).forEach(name => {
      if (USERS[name].token && USERS[name].token === token) {
        user = USERS[name]
      }
    })

    if (user) {
      return user
    }
  },

  handleLogout: (req, res) => {
    if (USERS[req.user.name]) {
      delete USERS[req.user.name].token
    } else {
      console.info('Tried to logout unknown user, that\'s strange!')
    }

    res.set('Set-Cookie', 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT')

    return res.end()
  }
}

module.exports = api
