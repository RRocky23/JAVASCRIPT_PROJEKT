import Item from '../models/Item.js';
import Inventory from '../models/Inventory.js';
import User from '../models/User.js';
import { ITEMS_CONFIG } from '../config/itemsConfig.js';

/**
 * Initialize shop items in database
 * Should be called on server startup or manually
 */
export const initializeShopItems = async (req, res) => {
  try {
    // Clear existing items (optional, comment out for production)
    // await Item.deleteMany({});

    const itemPromises = ITEMS_CONFIG.map(async (itemConfig) => {
      return await Item.findOneAndUpdate(
        { itemId: itemConfig.itemId },
        itemConfig,
        { upsert: true, new: true }
      );
    });

    await Promise.all(itemPromises);

    res.status(200).json({
      success: true,
      message: 'Shop items initialized successfully',
      count: ITEMS_CONFIG.length
    });
  } catch (error) {
    console.error('Error initializing shop items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize shop items',
      error: error.message
    });
  }
};

/**
 * Get all available shop items
 */
export const getShopItems = async (req, res) => {
  try {
    const items = await Item.find({ available: true }).sort({ price: 1 });

    // If no items exist, initialize from config
    if (items.length === 0) {
      const itemPromises = ITEMS_CONFIG.map(async (itemConfig) => {
        return await Item.create(itemConfig);
      });
      const newItems = await Promise.all(itemPromises);
      return res.status(200).json({
        success: true,
        items: newItems
      });
    }

    res.status(200).json({
      success: true,
      items
    });
  } catch (error) {
    console.error('Error fetching shop items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop items',
      error: error.message
    });
  }
};

/**
 * Get a specific shop item by ID
 */
export const getShopItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findOne({ itemId, available: true });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found or not available'
      });
    }

    res.status(200).json({
      success: true,
      item
    });
  } catch (error) {
    console.error('Error fetching shop item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shop item',
      error: error.message
    });
  }
};

/**
 * Purchase an item from the shop
 */
export const purchaseItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity = 1 } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity. Must be a positive integer.'
      });
    }

    // Get item details
    const item = await Item.findOne({ itemId, available: true });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found or not available for purchase'
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate total cost
    const totalCost = item.price * quantity;

    // Check if user has enough currency
    if (user.currency < totalCost) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient currency',
        required: totalCost,
        available: user.currency,
        shortage: totalCost - user.currency
      });
    }

    // Check inventory limit
    const existingInventory = await Inventory.findOne({ userId, itemId });
    const currentQuantity = existingInventory ? existingInventory.quantity : 0;
    const newQuantity = currentQuantity + quantity;

    if (newQuantity > item.maxQuantity) {
      return res.status(400).json({
        success: false,
        message: 'Purchase would exceed inventory limit',
        maxQuantity: item.maxQuantity,
        currentQuantity,
        attemptedQuantity: quantity,
        availableSpace: item.maxQuantity - currentQuantity
      });
    }

    // Perform transaction
    // 1. Deduct currency
    user.currency -= totalCost;
    user.updatedAt = new Date();
    await user.save();

    // 2. Add item to inventory
    if (existingInventory) {
      existingInventory.quantity = newQuantity;
      await existingInventory.save();
    } else {
      await Inventory.create({
        userId,
        itemId,
        quantity
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully purchased ${quantity}x ${item.itemName}`,
      purchase: {
        item: {
          itemId: item.itemId,
          itemName: item.itemName,
          itemType: item.itemType
        },
        quantity,
        totalCost,
        remainingCurrency: user.currency
      },
      inventory: {
        itemId,
        quantity: newQuantity
      }
    });
  } catch (error) {
    console.error('Error purchasing item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase item',
      error: error.message
    });
  }
};
