'use strict'

const Model = require('../models/model')
const uniqid = require('uniqid')
const moment = require('moment')

function savePaymentObligation(req, res){
	var codigo = uniqid()
	var day = moment().get('date')
	var month = moment().get('month') + 1
	var year = moment().get('year')

	if(day<10) day = `0${day}`
	if(month<10) month = `0${month}`

	var date = `${year}-${month}-${day}`

	Model.query(`INSERT INTO pagoobligacion VALUES ('${codigo}', '${req.body.obligacion_codigo}', '${req.body.user_id}', '${date}', '${req.body.monto}')`, (err, results) => {
		if(err || (results.affectedRows === 0))
			res.status(500).send({ message: `Error en el servidor: ${err}` })
		else 
			res.status(201).send({ codigo: codigo })
	})
}

function savePaymentGoal(req, res){
	var day = moment().get('date')
	var month = moment().get('month') + 1
	var year = moment().get('year')

	if(day<10) day = `0${day}`
	if(month<10) month = `0${month}`

	var date = `${year}-${month}-${day}`

	Model.query(`INSERT INTO abonometa VALUES ('${req.body.meta_codigo}', '${req.body.user_id}', '${date}', '${req.body.monto}')`, (err, results) => {
		if(err || (results.affectedRows === 0))
			res.status(500).send({ message: `Error en el servidor: ${err}` })
		else 
			res.status(201).send({ codigo: 'Ok' })
	})
}

function deletePayment(req, res){
	Model.query(`DELETE FROM pagoobligacion WHERE codigo = '${req.body.codigo}'`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else 
			res.status(200).send({ message: 'Pago eliminado' })
	})
}

function getPayments(req, res) {
	Model.query(`SELECT * FROM pagoobligacion`, (err, results) => {
		if(err)
			res.status(500).send({ message: `Error en el servidor, Err: ${err}` })
		else
			if(typeof result[0] === 'undefined')
				res.status(404).send({ message: '404 Not found.' })
			else 
				res.status(200).send({ group: result[0] })
	})
}

function getPaymentUser(req, res){
	//console.log('grupo_codigo: ' + req.params.grupo_codigo)
	Model.query(`SELECT SUM(monto) AS gastos FROM obligacion WHERE grupo_codigo = '${req.params.grupo_codigo}'`, (err, results) => {
		//console.log(results[0])
		if(err)
			res.status(500).send({ message: `Error en el servidor ${err}` })
		else
			if(typeof results[0] === 'undefined')
				res.status(200).send({ gastos: 0 })
			else{
				//console.log()
				res.status(200).send(results[0])
			}
	})
}

module.exports = {
	savePaymentObligation,
	savePaymentGoal,
	deletePayment,
	getPayments,
	getPaymentUser
}