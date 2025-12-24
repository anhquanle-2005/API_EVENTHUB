const express = require('express');
const Router = express.Router();
const taiKhoanController = require('../controller/taiKhoanController');
Router.post('/forgot-password', taiKhoanController.sendOtp);
Router.post('/verify-otp', taiKhoanController.verifyOtp);
Router.post('/reset-password', taiKhoanController.resetPassword);
Router.post('/',taiKhoanController.index);
Router.get('/diemtichluy/:id',taiKhoanController.diemtichluy);
module.exports = Router;
