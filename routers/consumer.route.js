const express = require('express')
const router = express.Router()
const consumerController = require('../controllers/consumer.controller')

router.post('/', consumerController.register)

module.exports = router