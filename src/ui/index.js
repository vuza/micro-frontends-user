const React = require('react')
const { renderToString } = require('react-dom/server')
// const { flushToHTML } = require('styled-jsx/server')
// const cheerio = require('cheerio')
import Login from './login'
import User from './user'
const config = require('config')

const port = config.get('port')
const domain = config.get('staticFilesDomain')

const ui = {
  _serveUser: (req, res) => {
    const html = renderToString(<User {...req.user} />)

    // const styles = flushToHTML()
    // const $ = cheerio.load(styles)

    // TODO write it to db
    // Provide it via specific route

    // const css = `<http://localhost:${port}/styles${$('style').attr('id')}.css>; rel="stylesheet"`
    const js = `<http://${domain}:${port}/user/bundle.js>; rel="fragment-script"`

    res.set({
      // Link: `${css}, ${js}`,
      Link: `${js}`,
      'Content-Type': 'text/html'
    })

    res.end(`<script>window.__APP_INITIAL_USER_STATE__ = ${JSON.stringify(req.user)}</script><span id="userRoot">${html}</span>`)
  },

  _serveLogin: (req, res) => {
    const html = renderToString(<Login/>)

    // const styles = flushToHTML()
    // const $ = cheerio.load(styles)

    // TODO write it to db
    // Provide it via specific route

    // const css = `<http://localhost:${port}/styles${$('style').attr('id')}.css>; rel="stylesheet"`
    const js = `<http://${domain}:${port}/login/bundle.js>; rel="fragment-script"`

    res.set({
      // Link: `${css}, ${js}`,
      Link: `${js}`,
      'Content-Type': 'text/html'
    })

    res.end(`<span id="loginRoot">${html}</span>`)
  },

  serveUi: (req, res) => req.user ? ui._serveUser(req, res) : ui._serveLogin(req, res)
}

module.exports = ui
