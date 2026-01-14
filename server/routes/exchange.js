import express from "express";
import {
  getCurrencyBalance,
  getExchangeablePokemon,
  exchangePokemons,
  calculateValue
} from "../controllers/exchangeController.js";

const router = express.Router();

/**
 * @swagger
 * /api/exchange/currency:
 *   get:
 *     summary: Get current user's currency balance
 *     tags: [Exchange]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns currency balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currency:
 *                   type: number
 *                   example: 150
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/currency", getCurrencyBalance);

/**
 * @swagger
 * /api/exchange/pokemons:
 *   get:
 *     summary: Get list of user's Pokemon with their exchange values
 *     tags: [Exchange]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns list of exchangeable Pokemon with values
 *       401:
 *         description: Unauthorized
 */
router.get("/pokemons", getExchangeablePokemon);

/**
 * @swagger
 * /api/exchange/calculate:
 *   post:
 *     summary: Calculate total value for selected Pokemon (preview)
 *     tags: [Exchange]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pokemonIds
 *             properties:
 *               pokemonIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f1f77bcf86cd799439011", "507f191e810c19729de860ea"]
 *     responses:
 *       200:
 *         description: Returns calculated values
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post("/calculate", calculateValue);

/**
 * @swagger
 * /api/exchange/exchange:
 *   post:
 *     summary: Exchange Pokemon for currency
 *     tags: [Exchange]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pokemonIds
 *             properties:
 *               pokemonIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f1f77bcf86cd799439011", "507f191e810c19729de860ea"]
 *     responses:
 *       200:
 *         description: Exchange successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalValue:
 *                   type: number
 *                   example: 250
 *                 newBalance:
 *                   type: number
 *                   example: 350
 *                 exchangedCount:
 *                   type: number
 *                   example: 2
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pokemon not found
 */
router.post("/exchange", exchangePokemons);

export default router;
