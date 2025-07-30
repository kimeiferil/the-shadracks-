const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { uploadMultiple } = require('../config/multer');

router.get('/photos', galleryController.getAllPhotos);
router.get('/albums', galleryController.getAllAlbums);
router.post('/upload', uploadMultiple, galleryController.uploadPhotos);
router.delete('/:id', galleryController.deletePhoto);
router.post('/albums', galleryController.createAlbum);

module.exports = router;
