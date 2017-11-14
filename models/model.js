'use strict'

const mysql = require('mysql')
const connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'monicapp',
	charset: 'utf8_spanish2_ci'
})

module.exports = connection