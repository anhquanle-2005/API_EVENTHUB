const express = require('express');
const Router = express.Router();
const taiKhoanController = require('../controller/taiKhoanController');
Router.post('/',taiKhoanController.index);
module.exports = Router;