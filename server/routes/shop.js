import express from 'express';
import * as shopController from '../controllers/shopController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/shop/items:
 *   get:
 *     summary: Get all available shop items
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available shop items
 *       500:
 *         description: Server error
 */
router.get('/items', authenticateToken, shopController.getShopItems);

/**
 * @swagger
 * /api/shop/items/:itemId:
 *   get:
 *     summary: Get a specific shop item
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shop item details
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
router.get('/items/:itemId', authenticateToken, shopController.getShopItem);

/**
 * @swagger
 * /api/shop/purchase:
 *   post:
 *     summary: Purchase an item from the shop
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Purchase successful
 *       400:
 *         description: Invalid request or insufficient currency
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
router.post('/purchase', authenticateToken, shopController.purchaseItem);

/**
 * @swagger
 * /api/shop/initialize:
 *   post:
 *     summary: Initialize shop items (admin/setup)
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shop items initialized
 *       500:
 *         description: Server error
 */
router.post('/initialize', authenticateToken, shopController.initializeShopItems);

export default router;
