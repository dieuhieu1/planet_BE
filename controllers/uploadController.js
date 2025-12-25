const { cloudinary } = require('../config/cloudinary');
const { success, error, paginatedSuccess } = require('./responseHelper');
const db = require('../models');

const uploadController = {
    // Upload single file
    uploadFile: async (req, res) => {
        try {
            console.log('Upload request received');
            console.log('File info:', req.file);

            if (!req.file) {
                console.error('No file in request');
                return error(res, 'No file uploaded', 400);
            }

            // Return file info directly without saving to DB
            const fileResponse = {
                url: req.file.path,
                public_id: req.file.filename,
                filename: req.file.originalname,
                format: req.file.mimetype.split('/')[1] || 'unknown'
            };

            console.log('Upload successful:', fileResponse.url);

            return success(res, fileResponse, 'File uploaded successfully');
        } catch (err) {
            console.error('Upload error:', err);
            return error(res, 'Upload failed', 500, err.message);
        }
    },


    // Upload multiple files
    uploadMultipleFiles: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return error(res, 'No files uploaded', 400);
            }

            const filesData = req.files.map(file => ({
                filename: file.originalname,
                public_id: file.filename,
                url: file.path,
                format: file.mimetype.split('/')[1] || 'unknown',
                resource_type: 'auto',
                details: file
            }));

            const createdFiles = await db.File.bulkCreate(filesData);

            return success(res, createdFiles, 'Files uploaded successfully');

        } catch (err) {
            return error(res, 'Upload failed', 500, err.message);
        }
    },

    // Delete file
    deleteFile: async (req, res) => {
        try {
            const { public_id } = req.body;
            if (!public_id) {
                return error(res, 'Missing public_id', 400);
            }

            // Find in DB
            const fileRecord = await db.File.findOne({ where: { public_id } });

            const resource_type = req.body.resource_type || 'image';

            const result = await cloudinary.uploader.destroy(public_id, { resource_type });

            if (result.result !== 'ok' && result.result !== 'not found') {
                return error(res, 'Cloudinary delete failed', 500, result);
            }

            // Delete from DB if exists
            if (fileRecord) {
                await fileRecord.destroy();
            }

            return success(res, result, 'File deleted successfully');
        } catch (err) {
            return error(res, 'Delete failed', 500, err.message);
        }
    },

    // Get all files
    getAllFiles: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const { count, rows } = await db.File.findAndCountAll({
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });
            return paginatedSuccess(res, rows, count, page, limit);
        } catch (err) {
            return error(res, 'Failed to fetch files', 500, err.message);
        }
    }
};

module.exports = uploadController;
