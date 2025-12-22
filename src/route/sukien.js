const express = require('express');
const Router = express.Router();
const suKienController = require('../controller/suKienController');
Router.get('/search', suKienController.search);
Router.get('/saptoi',suKienController.getSKSapToi);
Router.get('/', suKienController.index);
module.exports = Router;
