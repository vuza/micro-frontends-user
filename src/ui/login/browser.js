import React from 'react'
import { hydrate } from 'react-dom'
import App from './index'

hydrate(<App />, document.getElementById('loginRoot'))
