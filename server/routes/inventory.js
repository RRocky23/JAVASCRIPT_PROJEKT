import express from 'express';
import * as inventoryController from '../controllers/inventoryController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get user's complete inventory
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's inventory
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, inventoryController.getInventory);

/**
 * @swagger
 * /api/inventory/:itemId:
 *   get:
 *     summary: Get quantity of a specific item
 *     tags: [Inventory]
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
 *         description: Item quantity
 *       500:
 *         description: Server error
 */
router.get('/:itemId', authenticateToken, inventoryController.getItemQuantity);

/**
 * @swagger
 * /api/inventory/use:
 *   post:
 *     summary: Use/consume an item from inventory
 *     tags: [Inventory]
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
 *         description: Item used successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Item not found
 *       501:
 *         description: Feature not yet implemented
 *       500:
 *         description: Server error
 */
router.post('/use', authenticateToken, inventoryController.useItem);

/**
 * @swagger
 * /api/inventory/remove:
 *   delete:
 *     summary: Remove item from inventory
 *     tags: [Inventory]
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
 *         description: Item removed
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
router.delete('/remove', authenticateToken, inventoryController.removeItem);

export default router;
