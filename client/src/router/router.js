import { createRouter, createWebHistory } from "vue-router";
import * as tokenService from "../utils/tokenService.js";

import HomePage from "../views/Home.vue";
import MapPage from "../views/Map.vue"
import ErrorPage from "../views/Error.vue";

import accountRoutes from "./accountRoutes.js";
import profileRoutes from "./profileRoutes.js";
import starterRoutes from "./starterRoutes.js";
import pokedexRoutes from "./pokedexRoutes.js";
import shopRoutes from "./shopRoutes.js";

const routes = [
  { path: '/', name: 'Root', component: HomePage },
  { path: '/home', name: 'Home', component: HomePage, meta: { requiresAuth: true } },
  { path: '/map', name: 'Map', component: MapPage,  meta: { requiresAuth: true } },
  ...accountRoutes,
  ...profileRoutes,
  ...starterRoutes,
  ...pokedexRoutes,
  ...shopRoutes,
  { path: '/:pathMatch(.*)*', name: 'Error', component: ErrorPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = tokenService.getAccessToken();

  if (to.path === '/') {
    if (token) {
      // Check if user needs to select starter Pokemon
      try {
        const response = await fetch('/api/profile/tutorial-status', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.isNewUser && !data.hasCompletedTutorial) {
            return next({ path: '/starter/select-pokemon', replace: true });
          }
        }
      } catch (error) {
        console.error('Error checking tutorial status:', error);
      }
      return next({ path: '/home', replace: true });
    }
    return next({ path: '/starter/onboarding1', replace: true });
  }

  if (to.meta.requiresAuth && !token) {
    return next({ path: '/starter/onboarding4', replace: true });
  }

  // Check if authenticated user needs to complete tutorial
  if (token && to.path === '/home') {
    try {
      const response = await fetch('/api/profile/tutorial-status', {
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.isNewUser && !data.hasCompletedTutorial) {
          return next({ path: '/starter/select-pokemon', replace: true });
        }
      }
    } catch (error) {
      console.error('Error checking tutorial status:', error);
    }
  }

  next();
});

export default router;