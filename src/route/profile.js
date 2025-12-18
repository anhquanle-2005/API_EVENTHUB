const express = require('express');
const Router = express.Router();
const profileController = require('../controller/profileController');
Router.get('/profile/:userId',profileController.getUserProfile);
Router.get('/:userId/sapthamgia',profileController.getSuKienSapThamGiaByUserId);
Router.get('/:userId/dathamgia',profileController.getSuKienDaThamGiaByUserId);
module.exports = Router;