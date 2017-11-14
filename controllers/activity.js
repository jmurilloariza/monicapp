'use strict'

const Model = require('../models/model')
const moment = require('moment')
const uniqid = require('uniqid')

function saveActivity(req, res){
	var codigo = uniqid()
	var day = moment().get('date')
	var month = moment().get('month') + 1
	var year = moment().get('year')

	if(day<10) day = `0${day}`
	if(month<10) month = `0${month}`

	var date = `${year}-${month}-${day}`

	console.log(`Nueva peticion de registro de actividad`)
	console.log(`codigo: ${codigo}`)
	console.log(`email: ${req.body.user_email}`)
	console.log(`monto: ${req.body.monto}`)
	console.log(`fecha: ${date}`)
	console.log(`fecha_definida: ${req.body.fecha_definida}`)
	console.log(`lugar: ${req.body.lugar}`)

	Model.query(`INSERT INTO actividad VALUES ('${codigo}', '${req.body.user_email}', '${req.body.monto}', '${date}', '${req.body.fecha_definida}', '${req.body.lugar}')`, (err, results) => {
		console.log(`Iniciando peticion`)
		console.log(results)
		if(err || (results.affectedRows === 0)){
			console.log(`Error en el servidor: ${err}`)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		}
		else {
			console.log(`Peticion resuelta`)
			res.status(201).send({ codigo: codigo })
		}
	})
}

function deleteActivity(req, res){
	Model.query(`DELETE FROM actividad WHERE codigo = '${req.body.codigo}'`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else 
			res.status(200).send({ message: 'Actividad eliminada' })
	})
}

function getActivity(req, res){
	Model.query(`SELECT * FROM actividad WHERE codigo = '${req.params.codigo}'`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof results[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else
				res.status(200).send({ results })
	})
}

function getActivitysUser(req, res){
	Model.query(`SELECT * FROM actividad WHERE user_email = '${req.params.user_email}'`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof results[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else
				res.status(200).send({ results })
	})
}

function getActivitysExpired(req, res){
	var codigo = uniqid()
	var day = moment().get('date')
	var month = moment().get('month') + 1
	var year = moment().get('year')

	if(day<10) day = `0${day}`
	if(month<10) month = `0${month}`

	var date = `${year}-${month}-${day}`

	Model.query(`SELECT * FROM actividad WHERE user_email = '${req.params.user_email}' AND fecha_definida < '${date}'`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof results[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else
				res.status(200).send({ results })
	})
}

function getActivitysValid(req, res){
	var codigo = uniqid()
	var day = moment().get('date')
	var month = moment().get('month') + 1
	var year = moment().get('year')

	if(day<10) day = `0${day}`
	if(month<10) month = `0${month}`

	var date = `${year}-${month}-${day}`

	Model.query(`SELECT * FROM actividad WHERE user_email = '${req.params.user_email}' AND fecha_definida >= '${date}'`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof results[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else
				res.status(200).send({ results })
	})
}

function getActivitys(req, res){
	Model.query(`SELECT * FROM actividad`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof results[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else
				res.status(200).send({ results })
	})
}

function updateActivity(req, res){
	Model.query(`UPDATE actividad SET monto = '${req.body.monto}', fecha_definida = '${req.body.fecha_definida}', lugar = '${req.body.lugar}' WHERE codigo = '${req.body.codigo}'`, (err, results) => {
		if(err)
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		else
			if(results.affectedRows === 0) 
				res.status(404).send({message : '404 not found'})
			else 
				res.status(200).send({ message: 'Ok'})
	})
}

module.exports = {
	saveActivity,
	deleteActivity,
	getActivity,
	getActivitysUser,
	getActivitysExpired,
	getActivitysValid,
	updateActivity,
	getActivitys
}
