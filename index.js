'use strict'

const app = require('./app')
const config = require('./config')
const http = require('./sockets/server')
const ip = require('ip');

app.listen(config.port_api, () => {
    console.log(`SERVER OF API RUNNING IN http://${ip.address()}:${config.port_api}/`)
})

http.listen(config.port_socket, () => {
  	console.log(`SERVER OF SOCKET RUNNING IN http://${ip.address()}:${config.port_socket}/`)
});



