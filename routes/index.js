'use strict'

const express = require('express')
const user = require('../controllers/user')
const income = require('../controllers/income')
const group = require('../controllers/group')
const obligation = require('../controllers/obligation')
const goal = require('../controllers/goal')
const activity = require('../controllers/activity')
const payment = require('../controllers/payment')

const auth = require('../middlewares/auth')
const api = express.Router()

api.post('/user/signup', user.signUp) // iniciar sesión
api.post('/user/signin', user.signIn) // registro de usuarios
api.post('/user/addGroup', user.addToGroup) // añadir un usuario a un grupo
api.get('/user/:email', auth, user.getUser) // obtener un usuario por email
api.get('/user/name/:username', auth, user.getUserName) // obtener un usuario por username
api.get('/user', user.getUsers) // obtener todos los usuarios
api.put('/user', auth, user.updateUser) // modificar datos de usuario
api.delete('/user', auth, user.deleteUser) // eliminar usuario

api.post('/user/payment', auth, payment.savePaymentObligation) // registrar un pago obligacion
api.post('/user/payment/goal', auth, payment.savePaymentGoal) // registrar un abono a una meta
api.get('/user/payment/:grupo_codigo', auth, payment.getPaymentUser) // obtener pagos de un usuario
api.get('/user/payment', payment.getPayments) // obtener los pagos registrados
api.delete('/user/payment', auth, payment.deletePayment) // eliminar un pago

api.get('/incomes', auth, income.getIncomes) // obtener todos los incomeos registrados
api.get('/incomes/:user_id', auth, income.getIncomesUser) // obtener todos los incomeos de un user
api.post('/incomes', auth, income.saveIncome) // registrar un incomeo
api.get('/incomes/:user_id/:codigo', auth, income.getIncome) // obtener un incomeo determinado
api.put('/incomes', auth, income.updateIncome) // modificar un incomeo
api.delete('/incomes', auth, income.deleteIncome) // eliminar un incomeo

api.post('/group', auth, group.saveGroup) // registrar un grupo
api.get('/group/:codigo', auth, group.getGroup) // obtener un grupo determinado por codigo
api.get('/group/name/:name', auth, group.getGroupName) // obtener un grupo determinado por nombre 
api.get('/group', group.getGroups) // obtener todos los grupos registrados
api.get('/group/member/:codigo', auth, group.getMemberGroup) // obtener los miembros de un grupo
api.get('/group/member/count/:codigo', auth, group.getCantMemberGroup) // obtener la cantidad de miembros de un grupos
api.delete('/group', auth, group.deleteGroup) // eliminar un grupo de un usuario
api.put('/group', auth, group.updateGroup) // modificar un grupo

api.post('/group/obligation', auth, obligation.saveObligation) // registrar una obligacion
api.get('/group/obligation/:codigo', auth, obligation.getObligation) // obtener una obligacion por codigo
api.get('/group/obligation/fixed/:grupo_codigo', auth, obligation.getObligationFixed) // obtener las obligacion fijas de un grupo
api.get('/group/obligation/name/:name', auth, obligation.getObligationName) // obtener una obligacion por nombre
api.get('/group/obligation/code/:grupo_codigo', auth, obligation.getObligationsGroup) // obtener todas la obligaciones de un grupo
api.get('/group/obligation', auth, obligation.getObligations) // obtener todas las obligaciones
api.put('/group/obligation', auth, obligation.updateObligation) // modificar una obligacion
api.delete('/group/obligation', auth, obligation.deleteObligation) // eliminar una obligacion

api.post('/group/goal', auth, goal.saveGoal) // registrar una meta
api.get('/group/goal/code/:codigo', auth, goal.getGoal) // obtener meta por codigo
api.get('/group/goal/name/:name', auth, goal.getGoalName) // obtener meta por nambre
api.get('/group/goal/goals/:grupo_codigo', goal.getGoalsGroup) // obtener todas las metas de un grupo
api.get('/group/goal', goal.getGoals) // obtener todas las metas
api.put('/group/goal', auth, goal.updateGoal) // modificar una meta
api.delete('/group/goal', auth, goal.deleteGoal) // eliminar una meta

api.post('/activity', auth, activity.saveActivity) // registrar una nueva actividad
api.get('/activity', activity.getActivitys) // obtener todas las actividades registradas
api.get('/activity/code/:codigo', auth, activity.getActivity) // obtener los datos de una actividad por codigo
api.get('/activity/:user_email', auth, activity.getActivitysUser) // obtener todas las actividades de un usuario
api.get('/activity/expired/:user_email', auth, activity.getActivitysExpired) // obtener las actividades vencidad de un usuario
api.get('/activity/valid/:user_email', auth, activity.getActivitysValid) // obtener las actividades vigentes de un usuario
api.delete('/activity', auth, activity.deleteActivity) // eliminar una actividad
api.put('/activity', auth, activity.updateActivity) // modificar actividad

module.exports = api
