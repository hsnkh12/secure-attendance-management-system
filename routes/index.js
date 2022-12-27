const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index')


router.get('/', controllers.indexController)
router.post('/login', controllers.loginController)

module.exports = {
    indexRoutes: router
}