const React = require('react')
const { renderToString } = require('react-dom/server')
// const { flushToHTML } = require('styled-jsx/server')
// const cheerio = require('cheerio')
import Login from './login'
import User from './user'
const config = require('config')

const staticFilesConnectionString = config.get('staticFilesConnectionString')

const ui = {
  _serveUser: (req, res) => {
    const uiData = {user: req.user, apiConnectionString: config.get('apiConnectionString')}
    const html = renderToString(<User {...uiData} />)

    // const styles = flushToHTML()
    // const $ = cheerio.load(styles)

    // TODO write it to db
    // Provide it via specific route

    // const css = `<http://localhost:${port}/styles${$('style').attr('id')}.css>; rel="stylesheet"`
    const js = `<${staticFilesConnectionString}/user/bundle.js>; rel="fragment-script"`

    res.set({
      // Link: `${css}, ${js}`,
      Link: `${js}`,
      'Content-Type': 'text/html'
    })

    res.end(`<script>window.__APP_INITIAL_USER_STATE__ = ${JSON.stringify(uiData)}</script><span id="userRoot">${html}</span>`)
  },

  _serveLogin: (req, res) => {
    const uiData = {apiConnectionString: config.get('apiConnectionString')}
    const html = renderToString(<Login {...uiData} />)

    // const styles = flushToHTML()
    // const $ = cheerio.load(styles)

    // TODO write it to db
    // Provide it via specific route

    // const css = `<http://localhost:${port}/styles${$('style').attr('id')}.css>; rel="stylesheet"`
    const js = `<${staticFilesConnectionString}/login/bundle.js>; rel="fragment-script"`

    res.set({
      // Link: `${css}, ${js}`,
      Link: `${js}`,
      'Content-Type': 'text/html'
    })

    res.end(`<script>window.__APP_INITIAL_USER_STATE__ = ${JSON.stringify(uiData)}</script><span id="loginRoot">${html}</span>`)
  },

  serveUi: (req, res) => req.user ? ui._serveUser(req, res) : ui._serveLogin(req, res)
}

module.exports = ui
