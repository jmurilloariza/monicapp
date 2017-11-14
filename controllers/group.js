'use strict'

const Model = require('../models/model')
const moment = require('moment')
const uniqid = require('uniqid')

function saveGroup(req, res){
	var codigo = uniqid()
	var day = moment().get('date')
	var month = moment().get('month') + 1
	var year = moment().get('year')

	if(day<10) day = `0${day}`
	if(month<10) month = `0${month}`

	var date = `${year}-${month}-${day}`
	//console.log(date)

	Model.query(`INSERT INTO grupo VALUES('${codigo}', '${req.body.nombre}', '${date}', '0')`, (err, results) => {
		if(err || (results.affectedRows === 0))
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else 
			res.status(201).send({ codigo: codigo })
	})
}

function updateGroup(req, res) {
	Model.query(`UPDATE grupo SET nombre = '${req.body.nombre}' WHERE codigo = '${req.body.nombre}'`, (err, results) => {
		if(err)
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		else
			if(results.affectedRows === 0) 
				res.status(404).send({message : '404 not found'})
			else 
				res.status(200).send({ message: 'Ok'})
	})
}

function deleteGroup(req, res){
	Model.query(`DELETE FROM grupo WHERE codigo = '${req.body.codigo}'`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else 
			res.status(200).send({ message: 'Grupo eliminado' })
	})
}

function getGroup(req, res){
	//console.log('eas')
	Model.query(`SELECT nombre FROM grupo WHERE codigo = '${req.params.codigo}'`, (err, result) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof result[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else 
				res.status(200).send({ group: result[0] })
	})
}

function getGroupName(req, res) {
	Model.query(`SELECT * grupo WHERE nombre = '${req.params.nombre}'`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof result[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else 
				res.status(200).send({ group: result[0] })
	})
}

function getGroups(req, res){
	Model.query(`SELECT * FROM grupo`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof results[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else 
				res.status(200).send({ group: results[0] })
	})
}

function getMemberGroup(req, res){
	//console.log('codigo: ' + req.params.codigo)
	Model.query(`SELECT u.email, u.username, u.id FROM user AS u JOIN grupo AS g on u.grupo_codigo = g.codigo WHERE g.codigo = '${req.params.codigo}'`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof results[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else{
				//console.log(results)
				res.status(200).send({ member: results })
			}
	})
}

function promiseMember(codigo){
	return new Promise( (resolve, reject) => {
		Model.query(`SELECT u.email, u.username, u.codigo FROM user AS u JOIN grupo AS g on u.grupo_codigo = g.codigo WHERE g.codigo = '${codigo}'`, (err, result) => {
			if(err)
				return reject({status: 500, message: `Error en el servidor: ${err}`})
			if(typeof result[0] === 'undefined')
				return resolve({status: 201, message: `not found`})
			return resolve({status:201, message: result[0]})
		})
	})
}

function incomesGroup(user_email){
	return new Promise( (resolve, reject) => {
		Model.query(`SELECT SUM(valor) AS ingresos WHERE user_email = '${user_email}'`, (err, result) => {
			if(err)
				return reject({status: 500, message: `Error en el servidor: ${err}`})
			if(typeof result[0] === 'undefined')
				return resolve({status: 201, ingresos: 0})
			return resolve({status:201, ingresos: result[0]})
		})
	})
}

function getCantMemberGroup(req, res){
	Model.query(`SELECT cantidad_miembros FROM grupo WHERE codigo = '${req.params.codigo}'`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof results[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else{
				res.status(200).send(results[0])
			}
	})
}


module.exports = {
	saveGroup,
	deleteGroup,
	getGroup,
	getGroups,
	updateGroup,
	getGroupName,
	getMemberGroup, 
	getCantMemberGroup
}