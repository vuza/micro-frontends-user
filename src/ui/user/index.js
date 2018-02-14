import React from 'react'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.handleLogout = this.handleLogout.bind(this)
    this.state = {user: props}
  }

  handleLogout () {
    fetch('http://localhost:9090/user/api/logout', {
      method: 'POST',
      credentials: 'include'
    })
      .catch(() => this._handleError())
      .then(res => res.status === 200 ? this._handleSuccess() : this._handleError())
  }

  _handleSuccess () {
    window.location.replace('/user')
  }

  _handleError () {
    console.error('Sign out went wrong at server :( Still proceeding...')
  }

  render () {
    return [
      <p key="1">Hi, {this.state.user.name}! Go an <a href="/">buy something</a>!</p>,
      <p key="2">Or do you want to leave? Then <a href="#" onClick={ this.handleLogout }>logout</a> and leave!</p>
    ]
  }
}
