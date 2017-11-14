'use strict'

const services = require('../services')

function isAuth (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'No tienes autorización' })
  }
  //console.log(req.headers.authorization)
  const token = req.headers.authorization.split(' ')[1]

  //console.log('token: ****   ' + token)
  services.decodeToken(token)
    .then(response => {
      req.user = response
      next()
    })
    .catch(response => {
      res.status(response.status).send('Invalid Token')
    })
    
}

module.exports = isAuth
