<template>
  <nav class="bottom-nav">
    <router-link 
      to="/home" 
      class="nav-item"
      :class="{ active: isActive('/home') }"
    >
      <span class="nav-icon">🏠</span>
      <span v-if="isActive('/home')" class="nav-label">Home</span>
    </router-link>
    
    <router-link 
      to="/map" 
      class="nav-item"
      :class="{ active: isActive('/map') }"
    >
      <span class="nav-icon">🗺️</span>
      <span v-if="isActive('/map')" class="nav-label">Map</span>
    </router-link>

    <router-link 
      to="/pokedex" 
      class="nav-item"
      :class="{ active: isActive('/pokedex') }"
    >
      <span class="nav-icon">📖</span>
      <span v-if="isActive('/pokedex')" class="nav-label">Pokedex</span>
    </router-link>

    <router-link 
      to="/inventory" 
      class="nav-item"
      :class="{ active: isActive('/inventory') }"
    >
      <span class="nav-icon">🎒</span>
      <span v-if="isActive('/inventory')" class="nav-label">Inventory</span>
    </router-link>

    <router-link 
      to="/profile" 
      class="nav-item"
      :class="{ active: isActive('/profile') }"
    >
      <span class="nav-icon">👤</span>
      <span v-if="isActive('/profile')" class="nav-label">Profile</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const isActive = (path) => {
  if (path === '/home') {
    return route.path === '/home';
  }
  if (path === '/home/map') {
    return route.path === '/home/map';
  }
  if (path === '/profile') {
    return route.path === '/profile';
  }
  return route.path.startsWith(path);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 20px;
  background-color: #fff;
  border-top: 1px solid #E0E0E0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  min-width: 60px;
}

.nav-icon {
  font-size: 1.5rem;
  transition: transform 0.2s;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-label {
  font-family: "Kode Mono", monospace;
  font-size: 0.75rem;
  color: #1A1A1A;
  font-weight: 600;
}

.nav-item.active .nav-label {
  color: #FEC41B;
}

.nav-item.active .nav-icon {
  filter: drop-shadow(0 2px 4px rgba(254, 196, 27, 0.3));
}

/* Responsive */
@media (max-width: 1024px) {
  .nav-icon {
    font-size: 1.8rem;
  }

  .nav-label {
    font-size: 0.9rem;
  }

  .bottom-nav {
    padding: 16px 20px;
  }
}
</style>