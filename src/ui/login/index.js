import config from 'config'
import React from 'react'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {}
  }

  handleSubmit (e) {
    e.preventDefault()

    const formData = new FormData(e.target)

    fetch(`${config.get('apiConnectionString')}/user/api/login`, {
      method: 'POST',
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password')
      }),
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(res => res.status === 200 ? this._handleSuccess() : this._handleError())
      .catch(() => this._handleError())
  }

  _handleError () {
    this.setState(state => ({error: true}))
    this.forceUpdate()
  }

  _handleSuccess () {
    window.location.replace('/')
  }

  componentDidMount () {
    this.setState(state => ({error: undefined}))
  }

  render () {
    const html = []

    if (this.state.error) {
      html.push(<p key="1">Sorry something went wrong, try "peter" and "123"!</p>)
    } else {
      html.push(<p key="1">Go on, try something! Be brave!</p>)
    }

    html.push(<form key="2" onSubmit={ this.handleSubmit }>
      <label>
        Username
        <input type="text" name="username" />
      </label>
      <label>
        Password
        <input type="password" name="password" />
      </label>
      <input type="submit" value="Submit" />
    </form>)

    return html
  }
}
