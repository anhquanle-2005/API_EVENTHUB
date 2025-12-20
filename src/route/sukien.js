const express = require('express');
const Router = express.Router();
const suKienController = require('../controller/suKienController');
Router.get('/saptoi',suKienController.getSKSapToi);
Router.get('/timsukien',suKienController.timSuKien);
Router.get('/', suKienController.index);
Router.post('/',suKienController.dangKySuKien);
module.exports = Router;