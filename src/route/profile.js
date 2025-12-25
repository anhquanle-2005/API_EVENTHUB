const express = require('express');
const Router = express.Router();
const profileController = require('../controller/profileController');
const upload = require('../middleware/upload');
Router.get('/profile/:userId',profileController.getUserProfile);
Router.get('/:userId/sapthamgia',profileController.getSuKienSapThamGiaByUserId);
Router.get('/:userId/dathamgia',profileController.getSuKienDaThamGiaByUserId);
Router.put('/update-avatar/:userId', upload.single('avatar'), profileController.updateAvatar);
module.exports = Router;