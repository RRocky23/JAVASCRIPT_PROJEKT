import Inventory from '../models/Inventory.js';
import Item from '../models/Item.js';

/**
 * Get user's complete inventory
 */
export const getInventory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all inventory items for user
    const inventoryItems = await Inventory.find({ userId });

    // Get item details for each inventory item
    const inventoryWithDetails = await Promise.all(
      inventoryItems.map(async (invItem) => {
        const item = await Item.findOne({ itemId: invItem.itemId });
        return {
          itemId: invItem.itemId,
          quantity: invItem.quantity,
          itemDetails: item ? {
            itemName: item.itemName,
            itemType: item.itemType,
            description: item.description,
            sprite: item.sprite,
            price: item.price,
            maxQuantity: item.maxQuantity
          } : null,
          updatedAt: invItem.updatedAt
        };
      })
    );

    // Filter out items where details couldn't be found
    const validInventory = inventoryWithDetails.filter(item => item.itemDetails !== null);

    res.status(200).json({
      success: true,
      inventory: validInventory,
      totalItems: validInventory.length
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
      error: error.message
    });
  }
};

/**
 * Get quantity of a specific item in inventory
 */
export const getItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const inventoryItem = await Inventory.findOne({ userId, itemId });

    res.status(200).json({
      success: true,
      itemId,
      quantity: inventoryItem ? inventoryItem.quantity : 0
    });
  } catch (error) {
    console.error('Error fetching item quantity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch item quantity',
      error: error.message
    });
  }
};

/**
 * Use/consume an item from inventory
 * This is a placeholder for future functionality
 */
export const useItem = async (req, res) => {
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

    // Check if user has the item
    const inventoryItem = await Inventory.findOne({ userId, itemId });

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in inventory'
      });
    }

    if (inventoryItem.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient quantity in inventory',
        available: inventoryItem.quantity,
        requested: quantity
      });
    }

    // Get item details
    const item = await Item.findOne({ itemId });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item configuration not found'
      });
    }

    // TODO: Implement item usage logic based on item type
    // For now, just return a message that this feature is not yet implemented
    return res.status(501).json({
      success: false,
      message: 'Item usage functionality not yet implemented',
      item: {
        itemId: item.itemId,
        itemName: item.itemName,
        itemType: item.itemType
      }
    });

    // Future implementation would look like:
    // switch (item.itemType) {
    //   case 'pokeball':
    //     // Handle pokeball usage in battle
    //     break;
    //   case 'potion':
    //     // Handle healing
    //     break;
    //   case 'revive':
    //     // Handle revival
    //     break;
    //   default:
    //     return res.status(400).json({ success: false, message: 'Unknown item type' });
    // }
  } catch (error) {
    console.error('Error using item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to use item',
      error: error.message
    });
  }
};

/**
 * Remove item from inventory (for testing/admin purposes)
 */
export const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;

    const inventoryItem = await Inventory.findOne({ userId, itemId });

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in inventory'
      });
    }

    if (quantity >= inventoryItem.quantity) {
      // Remove completely
      await Inventory.deleteOne({ userId, itemId });
      return res.status(200).json({
        success: true,
        message: 'Item removed from inventory',
        itemId,
        remainingQuantity: 0
      });
    } else {
      // Reduce quantity
      inventoryItem.quantity -= quantity;
      await inventoryItem.save();
      return res.status(200).json({
        success: true,
        message: `Removed ${quantity} of item from inventory`,
        itemId,
        remainingQuantity: inventoryItem.quantity
      });
    }
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item',
      error: error.message
    });
  }
};
