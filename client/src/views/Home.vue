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
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth.js';
import axiosInstance from '../utils/axios.js';
import BottomNav from '../components/Buttons/BottomNav.vue';

const { user, fetchUser } = useAuth();
const pokemonCount = ref(0);
const discoveryCount = ref(0);
const level = ref(1);

onMounted(async () => {
  await fetchUser();
  
  try {
    const [pokemonRes, discoveryRes] = await Promise.all([
      axiosInstance.get('/api/profile/pokemon/count'),
      axiosInstance.get('/api/profile/discoveries/count')
    ]);
    
    pokemonCount.value = pokemonRes.data.count || 0;
    discoveryCount.value = discoveryRes.data.count || 0;
    
    level.value = Math.floor(pokemonCount.value / 10) + 1;
  } catch (err) {
    console.error('Error fetching stats:', err);
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600;700&display=swap');

.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 20px 100px 20px;
  font-family: "Kode Mono", monospace;
}

.home-content {
  max-width: 800px;
  margin: 0 auto;
}

.welcome-section {
  color: white;
  margin-bottom: 30px;
  text-align: center;
}

.welcome-section h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1A1A1A;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  margin-top: 2px;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.action-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.action-card.primary {
  background: linear-gradient(135deg, #FEC41B 0%, #FFB800 100%);
  color: white;
}

.action-card.primary h3,
.action-card.primary p {
  color: white;
}

.action-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.action-content h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #1A1A1A;
}

.action-content p {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .welcome-section h1 {
    font-size: 1.5rem;
  }

  .action-cards {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>