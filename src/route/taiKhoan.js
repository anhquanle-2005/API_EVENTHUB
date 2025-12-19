const express = require('express');
const Router = express.Router();
const taiKhoanController = require('../controller/taiKhoanController');
Router.post('/',taiKhoanController.index);
Router.post('/forgot-password', taiKhoanController.sendOtp);
Router.post('/verify-otp', taiKhoanController.verifyOtp);
Router.post('/reset-password', taiKhoanController.resetPassword);
module.exports = Router;
