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
          <PokemonCard v-for="pokemon in filteredPokemons" :key="pokemon.pokedexNumber" :pokemon="pokemon" :use-favourites="true" @click="goToPokemonDetail(pokemon.pokedexNumber)"/>
        </div>
      </div>
    </div>

    <BottomNavigation />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth.js';
import axiosInstance from '../../utils/axios.js';

import PokemonCard from '../../components/pokedex/PokemonCard.vue';
import BottomNavigation from './BottomNavigation.vue';

const { fetchUser, isLoggedIn, refresh } = useAuth();
const router = useRouter();
const pokemons = ref([]);
const searchQuery = ref('');
const loading = ref(true);

onMounted(async () => {
  if(!isLoggedIn.value) {
    router.push('/starter/onboarding4');
    return;
  }

  try {
    const currentUser = await fetchUser();

    if(currentUser == null) {
      console.error('User data not found. Try to sign in');
      router.push('/starter/onboarding4');
    }
    
    await refresh();

  }catch(error) {
    console.error('Failed to fetch user:', error);
    router.push('/starter/onboarding4');
  }

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
  if(!Array.isArray(pokemons.value)) {
    return [];
  }
  
  if(!searchQuery.value) {
    return pokemons.value
    .map(pokemon => ({...pokemon, name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).toLowerCase()}));
  }
  return pokemons.value.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  ).map(pokemon => ({...pokemon, name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).toLowerCase()}))
});

const handleSearch = () => {

};

const goToPokemonDetail = (pokedexNumber) => {
  console.log("Hello")
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
</style>