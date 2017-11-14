'use strict'

const Model = require('../models/model')
const moment = require('moment')
const uniqid = require('uniqid')

function saveObligation(req, res){
	//console.log()
	var day = moment().get('date')
	var month = moment().get('month') + 1
	var year = moment().get('year')

	if(day<10) day = `0${day}`
	if(month<10) month = `0${month}`

	var date = `${year}-${month}-${day}`
//console.log(req.body.grupo_codigo)
//console.log(req.body.nombre)
//console.log(req.body.monto)
//console.log(req.body.fecha_fin)
//console.log(req.body.frecuencia)
	
	Model.query(`INSERT INTO obligacion (grupo_codigo, nombre, monto, fecha_fin, frecuencia) VALUES ('${req.body.grupo_codigo}', '${req.body.nombre}', '${req.body.monto}', '${req.body.fecha_fin}', '${req.body.frecuencia}')`, (err, results) => {
		if(err || (results.affectedRows === 0)){
			//console.log(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		}
		else 
			res.status(201).send({ codigo: results.insertId })
	})
}

function deleteObligation(req, res){
	Model.query(`DELETE FROM obligacion WHERE codigo = '${req.body.codigo}'`, (err, results) => {
		if(err) 
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		else 
			if(results.affectedRows === 0) 
				res.status(404).send({message : '404 not found'})
			else 
				res.status(200).send({ message: 'Ok'})
	})
}

function getObligation(req, res){
	//console.log(`Codigo recibido : ${req.params.codigo}`)
	Model.query(`SELECT * FROM obligacion WHERE codigo = '${req.params.codigo}'`, (err, results) => {
		if(err){
			//console.log(`Esto arroglo la consulta: ${results}`)
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		}
		else 
			if(typeof results[0] === 'undefined') {
				//console.log(`No existe un grupo con ese codigo`)
				res.status(404).send({message : '404 not found'})
			}
			else {
				//console.log(`Petición servida Ok`)
				//console.log(`resultados: ${results}`)
				res.status(200).send({ users : results })
			}
	})
}

function getObligationsGroup(req, res){
	Model.query(`SELECT * FROM obligacion WHERE grupo_codigo = '${req.params.grupo_codigo}'`, (err, results) => {
		if(err)
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		else 
			if(typeof results[0] === 'undefined') 
				res.status(404).send({message : '404 not found'})
			else 
				res.status(200).send({ users : results })
	})
}

function getObligations(req, res){
	Model.query(`SELECT * FROM obligacion`, (err, results) => {
		if(err)
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		else 
			if(typeof results[0] === 'undefined') 
				res.status(404).send({message : '404 not found'})
			else 
				res.status(200).send({ users : results })
	})
}


function getObligationName(req, res){
	Model.query(`SELECT * FROM obligacion WHERE nombre = '${req.params.nombre}'`, (err, results) => {
		if(err)
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		else 
			if(typeof results[0] === 'undefined') 
				res.status(404).send({message : '404 not found'})
			else 
				res.status(200).send({ users : results })
	})
}

function updateObligation(req, res){

}

function getObligationFixed(req, res){
	Model.query(`SELECT SUM(o.monto) as pagos_fijos FROM obligacion AS o JOIN grupo AS g ON o.grupo_codigo = g.codigo WHERE g.codigo = '${req.params.grupo_codigo}'`, (err, results) => {
		if(err)
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		else 
			if(typeof results[0] === 'undefined') 
				res.status(404).send({message : '404 not found'})
			else 
				res.status(200).send({ results: results[0] })
	})
}

function getMontoObligations(req, res) {
	//console.log(req.params.grupo_codigo)
	Model.query(`SELECT SUM(monto) AS gastos FROM obligacion WHERE user_id = '${req.params.grupo_codigo}'`, (err, results) => {
		//console.log(results[0])
		if(err)
			res.status(500).send({ message: `Error en el servidor ${err}` })
		else
			if(typeof results[0] === undefined)
				res.status(200).send({ gastos: 0})
			else
				res.status(200).send(results[0])
	})
}

module.exports = {
	saveObligation,
	deleteObligation,
	getObligation,
	getObligations,
	getObligationsGroup,
	updateObligation,
	getObligationName,
	getObligationFixed, 
	getMontoObligations
}