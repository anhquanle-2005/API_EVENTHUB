const express = require('express');
const Router = express.Router();
const suKienController = require('../controller/suKienController');
const upload = require('../middleware/upload');

Router.get('/saptoi',suKienController.getSKSapToi);
Router.post('/timsukien',suKienController.timSuKien);
Router.put('/uploadminhchung/:id',suKienController.uploadMinhChung);
Router.get('/admin', suKienController.adminList);
Router.get('/', suKienController.index);
Router.post('/',suKienController.dangKySuKien);
Router.post('/create', upload.single('poster'), suKienController.createSuKien);
Router.put('/update/:id', upload.single('poster'), suKienController.updateSuKien);
Router.get('/thamgia/:maSK', suKienController.participants);
Router.put('/thamgia/:maSK/:maTK', suKienController.updateParticipantStatus);
module.exports = Router;
