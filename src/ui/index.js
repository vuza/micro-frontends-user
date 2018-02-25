const React = require('react')
const { renderToString } = require('react-dom/server')
const { flushToHTML } = require('styled-jsx/server')
const cheerio = require('cheerio')
import Login from './login'
import User from './user'
const config = require('config')
const AWS = require('aws-sdk')

const staticFilesConnectionString = config.get('staticFilesConnectionString')

const awsCredentialsFilePath = config.get('aws.credentialsFilePath')
const awsS3Bucket = config.get('aws.s3Bucket')

if (awsCredentialsFilePath) {
  AWS.config.loadFromPath(awsCredentialsFilePath)
}

const s3 = new AWS.S3()

const ui = {
  serveUi: (req, res) => {
    let App
    let data
    let root
    let name

    if (req.user) {
      App = User
      data = {user: req.user, apiConnectionString: config.get('apiConnectionString')}
      root = 'userRoot'
      name = 'user'
    } else {
      App = Login
      data = {apiConnectionString: config.get('apiConnectionString')}
      root = 'loginRoot'
      name = 'login'
    }

    buildView(App, name, data)
      .then(view => {
        res.set({
          Link: `<${view.css}>; rel="stylesheet", <${view.js}>; rel="fragment-script"`,
          'Content-Type': 'text/html'
        })

        res.end(`<script>window.__APP_INITIAL_USER_STATE__ = ${JSON.stringify(data)}</script><span id="${root}">${view.html}</span>`)
      })
  }
}

const buildView = (App, name, data) => {
  const html = renderToString(<App {...data} />)

  const styles = flushToHTML()
  const $ = cheerio.load(styles)
  const cssHash = $('style').attr('id')

  return doesCssExist(cssHash)
    .then(exists => {
      if (!exists) {
        return persistCss(cssHash, $('style').html())
      }
    })
    .then(() => ({
      js: `${staticFilesConnectionString}/${name}/bundle.js`,
      css: `http://${awsS3Bucket}.s3-website-us-east-1.amazonaws.com/${cssHash}.css`,
      html
    }))
}

const doesCssExist = name => new Promise((resolve, reject) => {
  s3.headObject({Bucket: awsS3Bucket, Key: `${name}.css`}, (err, data) => {
    if (err) {
      if (err.code === 'NotFound') {
        return resolve(false)
      }

      return reject(err)
    }

    resolve(true)
  })
})

const persistCss = (name, content) => new Promise((resolve, reject) => {
  s3.putObject({
    Body: content,
    Bucket: awsS3Bucket,
    Key: `${name}.css`,
    ContentType: 'text/css',
    ACL: 'public-read'
  }, (err, data) => {
    if (err) {
      return reject(err)
    }

    resolve()
  })
})

module.exports = ui
