<template>
  <div class="home-container">
    <div class="home-content">
      <div class="welcome-section">
        <h1>Welcome back, {{ user?.username || 'Trainer' }}! 👋</h1>
        <p class="subtitle">Ready to catch some Pokemon?</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <div class="stat-value">{{ pokemonCount }}</div>
            <div class="stat-label">Pokemon Caught</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📖</div>
          <div class="stat-info">
            <div class="stat-value">{{ discoveryCount }}</div>
            <div class="stat-label">Discoveries</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <div class="stat-value">{{ level || 1 }}</div>
            <div class="stat-label">Trainer Level</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <div class="stat-value">{{ money }}</div>
            <div class="stat-label">Currency Balance</div>
          </div>
        </div>
      </div>

      <div class="action-cards">
        <router-link to="/map" class="action-card primary">
          <div class="action-icon">🗺️</div>
          <div class="action-content">
            <h3>Explore Campus</h3>
            <p>Find and catch Pokemon around campus</p>
          </div>
        </router-link>

        <router-link to="/profile/myPokemons" class="action-card">
          <div class="action-icon">📦</div>
          <div class="action-content">
            <h3>My Pokemon</h3>
            <p>View your collection</p>
          </div>
        </router-link>

        <router-link to="/pokedex" class="action-card">
          <div class="action-icon">📖</div>
          <div class="action-content">
            <h3>Pokedex</h3>
            <p>Browse all Pokemon</p>
          </div>
        </router-link>

        <router-link to="/inventory" class="action-card">
          <div class="action-icon">🎒</div>
          <div class="action-content">
            <h3>Inventory</h3>
            <p>Manage your items</p>
          </div>
        </router-link>

        <router-link to="/shop" class="action-card">
          <div class="action-icon">🏪</div>
          <div class="action-content">
            <h3>Shop</h3>
            <p>Buy items and supplies</p>
          </div>
        </router-link>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth.js';
import axiosInstance from '../utils/axios.js';
import BottomNav from '../components/buttons/BottomNav.vue';

const { user, fetchUser } = useAuth();
const pokemonCount = ref(0);
const discoveryCount = ref(0);
const level = ref(1);
const money = ref(0);

onMounted(async () => {
  await fetchUser();
  
  try {
    const [pokemonRes, discoveryRes, moneyRes] = await Promise.all([
      axiosInstance.get('/api/profile/pokemon/count'),
      axiosInstance.get('/api/profile/discoveries/count'),
      axiosInstance.get('/api/exchange/currency')
    ]);
    
    pokemonCount.value = pokemonRes.data.count || 0;
    discoveryCount.value = discoveryRes.data.count || 0;
    money.value = moneyRes.data.currency || 0;
    
    level.value = Math.floor(pokemonCount.value / 10) + 1;
  } catch (err) {
    console.error('Error fetching stats:', err);
  }
});
</script>

<style scoped>
@import '../client/src/styles/HomeStyles.css';
</style>