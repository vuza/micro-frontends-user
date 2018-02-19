const express = require('express')
const config = require('config')
const bodyParser = require('body-parser')
const {serveUi} = require('./src/ui')
const {handleLogin, handleGetUser, getUserByToken, handleLogout} = require('./src/api')
const path = require('path')
const cookieParser = require('cookie-parser')

const server = express()
const port = config.get('port')

server.use(cookieParser())

// Since we are doing a lot of cross origin stuff we need to define what is allowed, otherwise the browsers will reject our async. requests
server.use((req, res, next) => {
  // Since (at least) Google Chrome does not accept a wildcard * for the Allow-Origin header, if credentials are included in the request, we need to defined the allowed origins explicitly
  res.header('Access-Control-Allow-Origin', config.get('accessControlHeader'))
  // We send and set cookies
  res.header('Access-Control-Allow-Credentials', 'true')
  // We send JSON and add a Content-Type header to make it parse-able
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// Enrich request with user data if available
server.use((req, res, next) => {
  const user = getUserByToken(req.cookies.token)

  if (user) {
    req.user = user
  }

  next()
})

server.use(bodyParser.json())
server.get('/ui/login', serveUi)
server.post('/api/login', handleLogin)
server.post('/api/logout', handleLogout)
server.get('/api/user/:token', handleGetUser)
server.use(express.static(path.join(__dirname, '/assets')))

server.listen(port, () => console.log(`listening to ${port}`))
