import React from 'react'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.handleLogout = this.handleLogout.bind(this)
    this.state = {user: props.user}
    this.fetchUrl = `${props.apiConnectionString}/user/api/logout`
  }

  handleLogout () {
    fetch(this.fetchUrl, {
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
    return <div>
      <p className="callToAction">Hi, {this.state.user.name}! Go and <a href="/">buy something</a>!</p>
      <p>Or do you want to leave? Then <a href="#" onClick={ this.handleLogout }>logout</a> and leave!</p>
      <style jsx>{`
        p {
          text-align: center;
        }
        p.callToAction {
          font-size: 2em;
          margin-bottom: .4em;
        }
      `}</style>
    </div>
  }
}
