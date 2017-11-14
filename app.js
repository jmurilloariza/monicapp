'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const api = require('./routes')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/monicapp', api)

app.get('/', (req, res) => {
  //res.status(200).send('API MonicApp 1.0.0')
  	res.sendfile('index.html');
})

module.exports = app
