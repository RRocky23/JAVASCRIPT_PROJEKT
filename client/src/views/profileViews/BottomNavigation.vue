<template>
  <nav class="bottom-nav">
    <button 
      class="nav-item" 
      :class="{ active: isActive('/profile/myPokemons') }"
      @click="$router.push('/profile/myPokemons')"
    >
      <span class="nav-icon">📦</span>
      <span v-if="isActive('/profile/myPokemons')" class="nav-label">My pokemons</span>
    </button>
    
    <button
      class="nav-item"
      :class="{ active: isActive('/profile/favourites') }"
      @click="$router.push('/profile/favourites')"
    >
      <span class="nav-icon">❤️</span>
      <span v-if="isActive('/profile/favourites')" class="nav-label">Favourites</span>
    </button>

    <button
      class="nav-item"
      :class="{ active: isActive('/profile/exchange') }"
      @click="$router.push('/profile/exchange')"
    >
      <span class="nav-icon">💰</span>
      <span v-if="isActive('/profile/exchange')" class="nav-label">Exchange</span>
    </button>

    <button
      class="nav-item"
      :class="{ active: isActive('/profile/friends') }"
      @click="$router.push('/profile/friends')"
    >
      <span class="nav-icon">👥</span>
      <span v-if="isActive('/profile/friends')" class="nav-label">Friends</span>
    </button>

    <button
      class="nav-item"
      :class="{ active: isActive('/profile') }"
      @click="$router.push('/profile')"
    >
      <span class="nav-icon">👤</span>
      <span v-if="isActive('/profile')" class="nav-label">Profile</span>
    </button>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const isActive = (path) => {
  if (path === '/profile') {
    return route.path === '/profile';
  }
  return route.path.startsWith(path);
};
</script>

<style scoped>
@import '../../styles/BottomNavigationStyles.css';
</style>