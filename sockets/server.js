'use strict'

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http)

const Group = require('../controllers/group')

var user = {}
var userActiv = []
var userInactiv = []
var group = []

io.on('connection', (socket) => {
	console.log('nuevo usuario')

	socket.on('init', (data) => {
		socket.leave(data.id)
		socket.leave(data.group)
		socket.join(data.group)
		socket.join(data.id)

		socket.broadcast.to(data.group).emit('hi', {hi: `${7877}`}) // envia a todos los del grupo acepto a quien emitio el evento
		io.in(data.id).emit('hi', {hi: `${7877}`})

		socket.id = data.id
		socket.room = data.group
		socket.username = data.userName

		console.log('ha iniciado ' + socket.username)
	})

	socket.on('disconnect', () => {
		socket.leave(socket.room)
		socket.leave(socket.id)
		console.log('un usuario se ha desconectado ' + socket.username)
	})

	socket.on('add-member', (data) => { // userName - userNameMember - codeGroup - codeNewMember
		console.log('add-member')
		console.log('userName: ' + data.userName)
		console.log('userNameMember: ' + data.userNameMember)
		console.log('codeGroup: ' + data.codeGroup)
		console.log('codeNewMember: ' + data.codeNewMember)
		//io.in(socket.id).emit('notif-group', {userName: data.userName, userNameMember: data.userNameMember})
		socket.broadcast.to(data.codeGroup).emit('notif-group', {userName: data.userName, userNameMember: data.userNameMember})
		//socket.broadcast.to(data.codeGroup).emit('notif-group', {userName: data.userName, userNameMember: data.userNameMember})
		io.in(data.codeNewMember).emit('notif-member', {userName: data.userName, codeGroup: data.codeGroup})
	})

	socket.on('add-obligation', (data) => { // codeGroup - userName - nameObligation
		console.log('add-obligation')
		console.log('codeGroup' + data.codeGroup)
		console.log('userName' + data.userName)
		console.log('nameObligation' + data.nameObligation)
		socket.broadcast.to(data.group).emit('notif-group', {userName: data.userName, userNameMember: data.userNameMember})
		//	socket.broadcast.to(data.codeGroup).emit("notif-obligation", {userName: data.userName, nameObligation: data.nameObligation})
	})

	socket.on('add-goal', (data) => { // codeGroup - userName - nameGoal
		console.log(data)
		socket.broadcast.to(data.codeGroup).emit("notif-goal", {userName: data.userName, nameGoal: data.nameGoal})
	})

	socket.on('payment-obligation', (data) => { // codeGroup - userName - namePayment
		console.log(data.codeGroup)
		socket.broadcast.to(data.codeGroup).emit("notif-payment-obligation", {userName: data.userName, namePayment: data.namePayment})
	})

	socket.on('payment-goal', (data) => { // codeGroup - userName - nameGoal
		socket.broadcast.to(data.codeGroup).emit("notif-payment-goal", {userName: data.userName, nameGoal: data.nameGoal})
	})
})

//io.to().emit() emite un memsaje a todos los miembros de un grupo

module.exports = http