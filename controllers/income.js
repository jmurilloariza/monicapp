'use strict'

const Model = require('../models/model')
const uniqid =  require('uniqid')

function getIncome(req, res) {
	Model.query(`SELECT * FROM ingreso WHERE user_email = '${req.params.user_id}' AND nombre = '${req.params.nombre}'`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor: ${err}` })
		else
			if(typeof results[0] === 'undefined') 
				res.status(404).send({message : '404 not found'})
			else
				res.status(200).send({ income: results })
	})
}

function getIncomes(req, res) {
	Model.query(`SELECT * FROM ingreso`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor: ${err}` })
		else
			if(typeof results[0] === 'undefined') 
				res.status(404).send({message : '404 not found'})
			else
				res.status(200).send({ incomes: results })

	})
}

function getIncomesUser(req, res) {
	Model.query(`SELECT SUM(valor) AS ingresos FROM ingreso WHERE user_id = '${req.params.user_id}'`, (err, results) => {
		//console.log(results[0])
		if(err)
			res.status(500).send({ message: `Error en el servidor: ${err}` })
		else
			if(typeof results[0] === 'undefined') 
				res.status(404).send({ ingresos: 0, user_id: req.params.user_id })
			else
				res.status(200).send({ ingresos: results[0].ingresos, user_id: req.params.user_id })

	})
}

function saveIncome(req, res) {
	var codigo = uniqid()
	//console.log('user_id ' + req.body.user_id)
	//console.log('nombre: ' + req.body.nombre)
	//console.log('valor: ' + req.body.valor)
	//console.log('frecuencia: ' + req.body.frecuencia)
	//console.log(codigo)
	//console.log('nueva petición de registro de income...')
	Model.query(`INSERT INTO ingreso VALUES ('${codigo}', '${req.body.user_id}', '${req.body.nombre}', '${req.body.valor}', '${req.body.frecuencia}')`, (err, results) => {
		if (err) {
			//console.log('erro en el servidor...')
			res.status(500).send({ message: `Error al crear el ingreso: ${err}` })  
		}
		else{
			//console.log('petición resuelta...')
			res.status(201).send({ income: codigo })
		}
	})
}

function updateIncome(req, res) {
	Model.query(`UPDATE ingreso SET nombre = '${req.body.nombre}', valor = '${req.body.valor}', frecuencia = '${req.body.frecuencia}' WHERE codigo = '${req.body.codigo}' AND user_id = '${req.body.user_id}'`, (err, results) => {
		if(err)
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		else
			if(results.affectedRows === 0) 
				res.status(404).send({message : '404 not found'})
			else 
				res.status(200).send({ message: 'Ok'})
	})
}

function deleteIncome(req, res) {
	Model.query(`DELETE FROM ingreso WHERE user_id = '${req.body.user_id}' AND codigo = '${req.body.codigo}'`, (err, results) => {
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
	getIncome,
	getIncomes,
	getIncomesUser,
	saveIncome,
	updateIncome,
	deleteIncome
}