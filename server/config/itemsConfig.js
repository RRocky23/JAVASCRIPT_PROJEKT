/**
 * Configuration for shop items
 * Defines all available items in the game
 */

export const ITEMS_CONFIG = [
  {
    itemId: 'poke_ball',
    itemName: 'Poké Ball',
    itemType: 'pokeball',
    description: 'A device for catching wild Pokémon. It is designed as a capsule system.',
    effect: 'catch',
    strength: 1,
    sprite: '/items/pokeball.png',
    price: 100,
    maxQuantity: 99,
    available: true
  },
  {
    itemId: 'great_ball',
    itemName: 'Great Ball',
    itemType: 'pokeball',
    description: 'A good, high-performance Poké Ball that provides a higher catch rate than a standard Poké Ball.',
    effect: 'catch',
    strength: 1.5,
    sprite: '/items/greatball.png',
    price: 400,
    maxQuantity: 99,
    available: true
  },
  {
    itemId: 'ultra_ball',
    itemName: 'Ultra Ball',
    itemType: 'pokeball',
    description: 'An ultra-high-performance Poké Ball that provides a higher catch rate than a Great Ball.',
    effect: 'catch',
    strength: 2,
    sprite: '/items/ultraball.png',
    price: 800,
    maxQuantity: 99,
    available: true
  }
];

/**
 * Item configuration constants
 */
export const ITEM_CONSTANTS = {
  DEFAULT_MAX_QUANTITY: 99,
  MIN_PURCHASE_QUANTITY: 1,
  BULK_PURCHASE_CONFIRMATION_THRESHOLD: 5
};
