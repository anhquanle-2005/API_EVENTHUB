const express = require('express');
const Router = express.Router();
const suKienController = require('../controller/suKienController');
Router.get('/saptoi',suKienController.getSKSapToi);
Router.get('/', suKienController.index);
module.exports = Router;