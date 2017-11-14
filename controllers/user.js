'use strict'

const Model = require('../models/model')
const service = require('../services/index')
const utf8 = require('utf8')
const uniqid = require('uniqid')

function signIn(req, res){
	var codigo = uniqid()
	Model.query(`INSERT INTO user (id, username, email, password) VALUES ('${codigo}', '${req.body.username}', '${req.body.email}', '${req.body.password}')`, (err, results) => {
		if (err) 
			res.status(409).send({ message: `El usuario ya existe` })  
		else{
			var token = service.createToken({id: req.body.email})
			
			if(updateToken(req.body.email, token) === false) 
				res.status(500).send({ message: '500' }) 
			else
				res.status(201).send({email: req.body.email, token: token, user_id: codigo})
		}
	})
}

function signUp(req, res){
	//console.log('Nueva petición...')
	Model.query(`SELECT username, email, token, grupo_codigo, id FROM user WHERE email = '${req.body.email}' AND password = '${req.body.password}'`, (err, results) => {
		//console.log()
		if(err) {
			//console.log('Error en el servidor...')
			res.status(500).send({ message: `Error en el servidor` }) 
		}
		else
			if(typeof results[0] === 'undefined') {
				//console.log('no existe el usuario...')
				res.status(404).send({message : '404 not found'})
			}
			else{
				//console.log('petición resuelta...')
				res.status(200).send({email: results[0].email, token: results[0].token,  grupo_codigo: results[0].grupo_codigo, user_id: results[0].id, name_user: results[0].username})
			}
	})
}

function getUser(req, res){
	//console.log(`Email: ${req.params.email}`)
	Model.query(`SELECT * FROM user WHERE email = '${req.params.email}'`, (err, results, fields) => {
		if(err) 
			res.status(500).send({ message : `Error al realizar la petición` }) 
		else
			if(typeof results[0] === 'undefined') 
				res.status(404).send({message : '404 not found'})
			else
				res.status(200).send({ users : results[0] })
	})
}

function getUsers(req, res){
	Model.query(`SELECT * FROM user`, (err, results) => {
		if(err){
			console.log(err)
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		}
		else 
			if(typeof results[0] === 'undefined') 
				res.status(404).send({message : '404 not found'})
			else 
				res.status(200).send({ users : results })
	})
}

function getUserName(req, res){
	Model.query(`SELECT * FROM user WHERE username = '${req.params.username}'`, (err, results) => {
		if(err)
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		else 
			if(typeof results[0] === 'undefined') 
				res.status(404).send({message : '404 not found'})
			else 
				res.status(200).send({ users : results })
	})
}

function updateUser(req, res){
	Model.query(`UPDATE user SET username = '${req.body.username}', password = '${req.body.password}' WHERE email = '${utf8.decode(req.body.email)}'`, (err, results) => {
		if(err)
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		else
			if(results.affectedRows === 0) 
				res.status(404).send({message : '404 not found'})
			else 
				res.status(200).send({ message: 'Ok'})
	})
}

function deleteUser(req, res){
	Model.query(`DELETE FROM user WHERE email = '${req.body.email}'`, (err, results) => {
		if(err) 
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		else 
			if(results.affectedRows === 0) 
				res.status(404).send({message : '404 not found'})
			else 
				res.status(200).send({ message: 'Ok'})
	})
}

function updateToken(email, token){
	Model.query(`UPDATE user SET token = '${token}' WHERE email = '${email}'`, (err, result) => {
		if(err) return true
		else return false
	})
}

function addToGroup(req, res){
	//console.log(req.body.grupo_codigo)
	//console.log(req.body.email)
	Model.query(`UPDATE user SET grupo_codigo = '${req.body.grupo_codigo}' WHERE email = '${req.body.email}'`, (err, result) => {
		if(err){
			//console.log(err)
			res.status(500).send({ message : `Error al realizar la petición: ${err}` })
		}
		else
			if(result.affectedRows === 0) {
				//console.log('Not Found')
				res.status(404).send({message : '404 not found'})
			}
			else {
				//console.log('Ok')
				res.status(200).send({ message: 'Ok'})
			}
	})

}

module.exports = {
	signIn,
	signUp, 
	getUser,
	getUsers, 
	updateUser,
	deleteUser,
	getUserName,
	addToGroup
}