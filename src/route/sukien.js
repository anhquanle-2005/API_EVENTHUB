const express = require('express');
const Router = express.Router();
const suKienController = require('../controller/suKienController');
Router.get('/sapdienra', suKienController.index);
Router.get('/saptoi',suKienController.getSKSapToi);
module.exports = Router;