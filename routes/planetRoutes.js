const express = require('express');
const router = express.Router();
const planetController = require('../controllers/planetController');

/**
 * @swagger
 * tags:
 *   name: Planet
 *   description: Planet management
 */

/**
 * @swagger
 * /planets:
 *   get:
 *     summary: Get all planets
 *     tags: [Planet]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of planets (Paginated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalItems:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         currentPage:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nameVi:
 *                             type: string
 *                           nameEn:
 *                             type: string
 *                           planetId:
 *                             type: string
 *                           type:
 *                             type: string
 *                           image2d:
 *                             type: string
 *                           model3d:
 *                             type: string
 *                           shortDescription:
 *                             type: string
 *                           overview:
 *                             type: string
 *                           physical:
 *                             type: object
 *                           orbit:
 *                             type: object
 *                           moons:
 *                             type: array
 *                           gases:
 *                             type: array
 */
router.get('/', planetController.getAll);

/**
 * @swagger
 * /planets/{id}:
 *   get:
 *     summary: Get planet by ID
 *     tags: [Planet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Planet ID (Auto Inc)
 *     responses:
 *       200:
 *         description: Planet details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nameVi:
 *                       type: string
 *                     nameEn:
 *                       type: string
 *       404:
 *         description: Planet not found
 */
router.get('/:id', planetController.getOne);

/**
 * @swagger
 * /planets:
 *   post:
 *     summary: Create a new planet
 *     tags: [Planet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planetId
 *               - nameVi
 *               - physical
 *               - orbit
 *               - moons
 *               - gases
 *             properties:
 *               planetId:
 *                 type: string
 *               nameVi:
 *                 type: string
 *               nameEn:
 *                 type: string
 *               type:
 *                 type: string
 *               image2d:
 *                 type: string
 *               model3d:
 *                 type: string
 *               physical:
 *                 type: object
 *               orbit:
 *                 type: object
 *               moons:
 *                 type: array
 *               gases:
 *                 type: array
 *           example:
 *             planetId: "mars"
 *             nameVi: "Sao Hỏa"
 *             nameEn: "Mars"
 *             type: "Rocky"
 *             image2d: "https://example.com/mars.png"
 *             model3d: "https://example.com/mars.glb"
 *             physical:
 *               density: 3.93
 *               gravity: 3.72
 *               temperatureAvgC: -63
 *               massKg: 6.4e23
 *               radiusKm: 3389
 *             orbit:
 *               orbitalPeriodDays: 687
 *               rotationPeriodHours: 24.6
 *               distanceFromSunKm: 227900000
 *               axialTiltDeg: 25.19
 *             moons:
 *               - name: "Phobos"
 *                 diameterKm: 22
 *             gases:
 *               - gasId: 1
 *                 percentage: 95.32
 *     responses:
 *       201:
 *         description: Planet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Planet created successfully"
 *                 data:
 *                   type: object
 */
router.post('/', planetController.create);

/**
 * @swagger
 * /planets/{id}:
 *   put:
 *     summary: Update planet
 *     tags: [Planet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Planet ID (Auto Inc)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameVi:
 *                 type: string
 *               nameEn:
 *                 type: string
 *               type:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               overview:
 *                 type: string
 *               image2d:
 *                 type: string
 *               model3d:
 *                 type: string
 *               physical:
 *                 type: object
 *               orbit:
 *                 type: object
 *               moons:
 *                 type: array
 *               gases:
 *                 type: array
 *           example:
 *             nameVi: "Sao Hỏa (Đã cập nhật)"
 *             nameEn: "Mars Updated"
 *             type: "Rocky"
 *             image2d: "http://example.com/new_mars.png"
 *             model3d: "http://example.com/new_mars.glb"
 *             physical:
 *               density: 4.0
 *             orbit:
 *               orbitalPeriodDays: 688
 *             moons:
 *               - name: "Phobos Updated"
 *                 diameterKm: 22
 *             gases:
 *               - gasId: 1
 *                 percentage: 95.0
 *     responses:
 *       200:
 *         description: Planet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Planet updated successfully"
 */
router.put('/:id', planetController.update);

/**
 * @swagger
 * /planets/{id}:
 *   delete:
 *     summary: Delete planet
 *     tags: [Planet]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Planet ID (Auto Inc)
 *     responses:
 *       200:
 *         description: Planet deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Planet deleted successfully"
 */
router.delete('/:id', planetController.delete);

module.exports = router;
