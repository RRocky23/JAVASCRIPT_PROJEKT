import Shop from '../views/shopViews/Shop.vue';
import Inventory from '../views/shopViews/Inventory.vue';

export default [
  {
    path: '/shop',
    name: 'Shop',
    component: Shop,
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: Inventory,
    meta: { requiresAuth: true }
  }
];
