const express = require('express');
const Router = express.Router();
const suKienController = require('../controller/suKienController');

// SEARCH (từ file 1)
Router.get('/search', suKienController.search);

// USER
Router.get('/saptoi', suKienController.getSKSapToi);
Router.post('/timsukien', suKienController.timSuKien);
Router.put('/uploadminhchung/:id', suKienController.uploadMinhChung);
Router.post('/sukiendathamgia',suKienController.suKienDaThamGia);
Router.post('/', suKienController.dangKySuKien);

// ADMIN / MANAGEMENT (từ file 2)
Router.get('/admin', suKienController.adminList);
Router.get('/all', suKienController.all);
Router.put('/update/:id', suKienController.updateEvent);

Router.get('/thamgia/:maSK', suKienController.participants);
Router.put('/thamgia/:maSK/:maTK', suKienController.updateParticipantStatus);
Router.delete('/thamgia/:maSK/:maTK', suKienController.cancelRegistration);

// INDEX (để cuối cùng)
Router.get('/', suKienController.index);

module.exports = Router;
