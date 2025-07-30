const Photo = require('../models/Photo');
const Album = require('../models/Album');
const fs = require('fs');
const path = require('path');

// Get all photos
exports.getAllPhotos = async (req, res) => {
    try {
        const { page = 1, limit = 20, albumId, search } = req.query;
        const skip = (page - 1) * limit;
        
        let query = {};
        if (albumId) query.album = albumId;
        if (search) {
            query.$or = [
                { caption: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }
        
        const photos = await Photo.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('album', 'name')
            .sort({ createdAt: -1 });
            
        const total = await Photo.countDocuments(query);
        
        res.json({
            success: true,
            data: photos,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Upload photos
exports.uploadPhotos = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }
        
        const { albumId, caption } = req.body;
        const uploadedPhotos = [];
        
        // Process each file
        for (const file of req.files) {
            const photo = new Photo({
                filename: file.filename,
                path: `/assets/images/uploads/${file.filename}`,
                album: albumId || null,
                caption: caption || '',
                uploadedBy: req.user.id,
                size: file.size,
                mimetype: file.mimetype
            });
            
            await photo.save();
            uploadedPhotos.push(photo);
        }
        
        res.json({
            success: true,
            message: `${uploadedPhotos.length} photos uploaded successfully.`,
            photos: uploadedPhotos
        });
    } catch (err) {
        // Clean up uploaded files if error occurs
        if (req.files) {
            req.files.forEach(file => {
                fs.unlinkSync(file.path);
            });
        }
        res.status(500).json({ error: err.message });
    }
};

// Delete photo
exports.deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ error: 'Photo not found' });
        }
        
        // Delete file from filesystem
        const filePath = path.join(__dirname, '../../public', photo.path);
        fs.unlinkSync(filePath);
        
        // Delete from database
        await photo.remove();
        
        res.json({ success: true, message: 'Photo deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all albums
exports.getAllAlbums = async (req, res) => {
    try {
        const albums = await Album.find().sort({ name: 1 });
        res.json({ success: true, data: albums });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create new album
exports.createAlbum = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const album = new Album({
            name,
            description,
            createdBy: req.user.id
        });
        
        await album.save();
        
        res.json({ success: true, data: album });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
