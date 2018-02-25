import React from 'react'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {}
    this.fetchUrl = `${props.apiConnectionString}/user/api/login`
  }

  handleSubmit (e) {
    e.preventDefault()

    const formData = new FormData(e.target)

    fetch(this.fetchUrl, {
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
    const text = this.state.error ? 'Sorry something went wrong, try "peter" and "123"!' : 'Go on, try something! Be brave!'

    return <div>
      <p>{text}</p>

      <form onSubmit={ this.handleSubmit }>
        <label>
          Username
          <input type="text" name="username" />
        </label>
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <input type="submit" value="Submit" />
      </form>

      <style jsx>{`
        p {
          font-weight: bold;
          margin-bottom: .4em;
        }
        label {
          display: block;
          margin-bottom: .4em;
          position: relative;
        }
        label input[type="text"], label input[type="password"] {
          position: absolute;
          left: 90px;
        }
        input[type="submit"] {
          cursor: pointer;
          border: 1px solid black;
          text-transform: uppercase;
          background: #ff6961;
        }
        input[type="submit"]:hover {
          background:white;
        }
      `}</style>
    </div>
  }
}
