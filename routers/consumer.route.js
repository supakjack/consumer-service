const express = require('express')
const router = express.Router()
const consumerController = require('../controllers/consumer.controller')

router.post('/register', consumerController.register)
router.post('/login', consumerController.login)

module.exports = router