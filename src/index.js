import React from 'react'
import { render } from 'react-dom'
import { App } from './components/App'
import './reset.css'

const app = <App />
const here = document.querySelector('#here')
render(app, here)
