const express = require('express');
const Router = express.Router();
const suKienController = require('../controller/suKienController');
Router.get('/saptoi',suKienController.getSKSapToi);
Router.post('/timsukien',suKienController.timSuKien);
Router.put('/uploadminhchung/:id',suKienController.uploadMinhChung);
Router.get('/', suKienController.index);
Router.post('/',suKienController.dangKySuKien);
module.exports = Router;