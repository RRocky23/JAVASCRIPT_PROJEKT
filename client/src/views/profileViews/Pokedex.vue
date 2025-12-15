<template>
  <div class="pokedex-page">
    <!-- Header -->
    <div class="header">
      <div class="header-spacer"></div>
      <div class="header-title">Pokedex</div>
      <div class="header-spacer"></div>
    </div>

    <div class="content">
      <!-- Search Bar -->
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Name of the Pokemon"
          @input="handleSearch"
        />
        <button class="filter-btn">☰</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <!-- Pokemon List (Scrollable) -->
      <div v-else class="pokemon-list-container">
        <div class="pokemon-list">
          <div
            v-for="pokemon in filteredPokemons"
            :key="pokemon.pokedexNumber"
            class="pokemon-card"
            :style="{ backgroundColor: getPokemonColor(pokemon.color) }"
            @click="goToPokemonDetail(pokemon.pokedexNumber)"
          >
            <img :src="pokemon.spriteURL" :alt="pokemon.name" class="pokemon-sprite" />
            <div class="pokemon-info">
              <h3 class="pokemon-name">{{ pokemon.name }}</h3>
              <p class="pokemon-number">N°{{ String(pokemon.pokedexNumber).padStart(3, '0') }}</p>
              <div class="pokemon-types">
                <span
                  v-if="pokemon.typeOne"
                  class="type-badge"
                  :class="`type-${pokemon.typeOne.toLowerCase()}`"
                >
                  {{ pokemon.typeOne }}
                </span>
                <span
                  v-if="pokemon.typeTwo"
                  class="type-badge"
                  :class="`type-${pokemon.typeTwo.toLowerCase()}`"
                >
                  {{ pokemon.typeTwo }}
                </span>
              </div>
            </div>
            <button class="favorite-btn" @click.stop="toggleFavorite(pokemon)">
              {{ isFavorite(pokemon.pokedexNumber) ? '❤️' : '🤍' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <BottomNavigation />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axiosInstance from '../../utils/axios.js';
import BottomNavigation from './BottomNavigation.vue';

const router = useRouter();
const pokemons = ref([]);
const searchQuery = ref('');
const loading = ref(true);
const favorites = ref(JSON.parse(localStorage.getItem('pokemonFavorites') || '[]'));

onMounted(async () => {
  try {
    const response = await axiosInstance.get('/api/profile/pokedex');
    pokemons.value = response.data;
  } catch (error) {
    console.error('Error loading pokemons:', error);
  } finally {
    loading.value = false;
  }
});

const filteredPokemons = computed(() => {
  if (!searchQuery.value) return pokemons.value;
  
  return pokemons.value.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleSearch = () => {

};

const getPokemonColor = (color) => {
  const colors = {
    red: '#FFE0E0',
    blue: '#E0F0FF',
    yellow: '#FFF8E0',
    green: '#E0FFE0',
    purple: '#F0E0FF',
    pink: '#FFE0F0',
    brown: '#F0E8E0',
    gray: '#F0F0F0',
    white: '#FFFFFF',
    black: '#E8E8E8'
  };
  return colors[color?.toLowerCase()] || '#F0F0F0';
};

const isFavorite = (pokedexNumber) => {
  return favorites.value.includes(pokedexNumber);
};

const toggleFavorite = (pokemon) => {
  const index = favorites.value.indexOf(pokemon.pokedexNumber);
  if (index > -1) {
    favorites.value.splice(index, 1);
  } else {
    favorites.value.push(pokemon.pokedexNumber);
  }
  localStorage.setItem('pokemonFavorites', JSON.stringify(favorites.value));
};

const goToPokemonDetail = (pokedexNumber) => {
  router.push(`/profile/pokedex/${pokedexNumber}`);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

.pokedex-page {
  width: 100vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

/* HEADER */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #fff;
  flex-shrink: 0;
}

.header-title {
  font-family: "JetBrains Mono", monospace;
  font-size: 1.2rem;
  font-weight: 500;
  color: #000;
}

.header-spacer {
  width: 36px;
}

/* CONTENT */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 24px 0;
  overflow: hidden;
}

/* SEARCH */
.search-container {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.95rem;
  border: 2px solid #E0E0E0;
  border-radius: 6px;
  outline: none;
}

.search-input:focus {
  border-color: #FEC41B;
}

.filter-btn {
  padding: 12px 16px;
  background-color: #FEC41B;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
}

/* LOADING */
.loading-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #FEC41B;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* POKEMON LIST */
.pokemon-list-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 80px;
  padding-right: 4px;
}

.pokemon-list-container::-webkit-scrollbar {
  width: 6px;
}

.pokemon-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.pokemon-list-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.pokemon-list-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.pokemon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
}

.pokemon-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
  border: 1px solid #E0E0E0;
}

.pokemon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pokemon-sprite {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-right: 16px;
  image-rendering: pixelated;
}

.pokemon-info {
  flex: 1;
}

.pokemon-name {
  font-family: "JetBrains Mono", monospace;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1A1A1A;
}

.pokemon-number {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 8px 0;
}

.pokemon-types {
  display: flex;
  gap: 6px;
}

.type-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
}

.type-water { background-color: #6890F0; }
.type-fire { background-color: #F08030; }
.type-grass { background-color: #78C850; }
.type-electric { background-color: #F8D030; }
.type-psychic { background-color: #F85888; }
.type-ice { background-color: #98D8D8; }
.type-dragon { background-color: #7038F8; }
.type-dark { background-color: #705848; }
.type-fairy { background-color: #EE99AC; }
.type-normal { background-color: #A8A878; }
.type-fighting { background-color: #C03028; }
.type-flying { background-color: #A890F0; }
.type-poison { background-color: #A040A0; }
.type-ground { background-color: #E0C068; }
.type-rock { background-color: #B8A038; }
.type-bug { background-color: #A8B820; }
.type-ghost { background-color: #705898; }
.type-steel { background-color: #B8B8D0; }

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;
}
</style>