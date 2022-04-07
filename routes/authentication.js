const express = require('express')
const router = express.Router()
const app = express()
const authController = require('../controllers/auth.controller')
const {verifyToken} = require('../middleware/auth')


router.post('/signup',authController.signup)
router.post('/login',authController.login)
router.post('/change-password',verifyToken,authController.changePassword)
router.post('/forgot-password',authController.forgotPassword)
router.post('/reset-password',authController.resetPassword)




module.exports= router