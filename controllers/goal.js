'use strict'

const Model = require('../models/model')
const moment = require('moment')
const uniqid = require('uniqid')

function saveGoal(req, res){
	var codigo = uniqid()
	var day = moment().get('date')
	var month = moment().get('month') + 1
	var year = moment().get('year')

	if(day<10) day = `0${day}`
	if(month<10) month = `0${month}`

	var date = `${year}-${month}-${day}`
	
	console.log(`Nueva petición registro de meta`)
	console.log(`codigo: ${codigo}`)
	console.log(`Grupo codigo: ${req.body.grupo_codigo}`)
	console.log(`nombre: ${req.body.nombre}`)
	console.log(`Descripcion: ${req.body.descripcion}`)
	console.log(`Valor: ${req.body.valor}`)
	console.log(`fecha: ${date}`)
	console.log(`Fecha fin: ${req.body.fecha_fin}`)
	console.log(`frecuencia: ${req.body.frecuencia}`)

	Model.query(`INSERT INTO meta VALUES ('${codigo}', '${req.body.grupo_codigo}', '${req.body.nombre}', '${req.body.descripcion}', '${req.body.valor}', '${date}', '${req.body.fecha_fin}', '1', '${req.body.frecuencia}')`, (err, results) => {
		console.log(`Iniciando peticion`)
		console.log(results)
		if(err || (results.affectedRows === 0)){
			console.log(`Error en el servidor: ${err}`)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		}
		else {
			console.log(`Peticion resuelta`)
			res.status(201).send({ 
				codigo: codigo,
				nombre: req.body.nombre,
				monto: req.body.valor,
				fecha_fin: req.body.fecha_fin 
			})
		}
	})
}

function deleteGoal(req, res){
	Model.query(`DELETE FROM meta WHERE codigo = '${req.body.codigo}'`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else 
			res.status(200).send({ message: 'Meta eliminada' })
	})
}

function getGoal(req, res){
	Model.query(`SELECT * FROM meta WHERE codigo = '${req.params.codigo}'`, (err, result) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof result[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else 
				res.status(200).send({ meta: result[0] })
	})
}

function getGoals(req, res){
	Model.query(`SELECT * FROM meta`, (err, result) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof result[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else 
				res.status(200).send({ result })
	})
}

function getGoalsGroup(req, res){
	console.log('grupo_codigo: ' + req.params.grupo_codigo)
	Model.query(`SELECT * FROM meta WHERE grupo_codigo = '${req.params.grupo_codigo}'`, (err, result) => {
		console.log(result)
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof result[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else 
				res.status(200).send({ result })
	})
}

function getGoalName(req, res){

}

function updateGoal(req, res){

}

module.exports = {
	saveGoal,
	deleteGoal,
	getGoal,
	getGoals,
	getGoalName,
	updateGoal,
	getGoalsGroup
}