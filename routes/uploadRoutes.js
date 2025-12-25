const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const uploader = require("../middlewares/uploader")

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload management
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a single file
 *     tags: [Upload]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     public_id:
 *                       type: string
 */
router.post('/', uploader.single('file'), uploadController.uploadFile);

/**
 * @swagger
 * /upload/multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Upload]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 */
// router.post('/multiple', uploader.array('files', 10), uploadController.uploadMultipleFiles); // Uncomment when implemented

/**
 * @swagger
 * /upload:
 *   delete:
 *     summary: Delete a file
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               public_id:
 *                 type: string
 *                 example: "folder/image123"
 *               resource_type:
 *                 type: string
 *                 default: image
 *                 example: "image"
 *     responses:
 *       200:
 *         description: File deleted successfully
 */
router.delete('/', uploadController.deleteFile);

module.exports = router;
