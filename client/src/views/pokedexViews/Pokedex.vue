<template>
    <div class="pokedex-page">
        <Header header-title="Pokedex" />

        <div class="content">
            <PokemonSearch v-if="!loading" v-model:searchQuery="searchState.searchQuery.value" @search="handleSearch" @toggleFilter="toggleFilterPanel" />
            <PokemonFilter :isOpen="isFilterOpen" :filters="searchState.filters.value" :type-resources="typeResources" :search-mode="searchMode"
                           :engine="engineType" @close="closeFilterPanel" @update:filters="handleFilterUpdate" />

            <Spinner v-if="loading" />

            <div v-else class="pokemon-list-container">
                <div class="pokemon-list">
                    <PokemonCard v-for="pokemon in searchState.processedData.value" 
                    :key="pokemon.pokedexNumber" 
                    :pokemon="pokemon" 
                    :use-favourites="false" 
                    @click="goToPokemonDetail(pokemon.pokedexNumber)"/>
                </div>
            </div>
        </div>
        <BottomNav />
      </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuth } from '../../composables/useAuth.js';
  import { useSearch, SEARCH_MODES, SEARCH_ENGINES } from '../../composables/useSearch.js';
  import { getPokemonTypes } from '../../utils/pokemonTypes.js';

  import axiosInstance from '../../utils/axios.js';

  import Header from '../../components/common/Header.vue';
  import BottomNav from '../../components/buttons/BottomNav.vue';
  import PokemonSearch from '../../components/search/PokemonSearch.vue';
  import PokemonFilter from '../../components/search/PokemonFilter.vue';
  import Spinner from '../../components/common/Spinner.vue';
  import PokemonCard from '../../components/pokedex/PokemonCard.vue';

  const { fetchUser, isLoggedIn, refresh } = useAuth();
  const router = useRouter();

  const pokemons = ref([]);
  const typeResources = ref(getPokemonTypes());
  const loading = ref(true);
  const isFilterOpen = ref(false);
  const searchMode = SEARCH_MODES.ALL_POKEMONS;
  const engineType = SEARCH_ENGINES.POKEMON_ONLY;

  const searchState = useSearch({
    mode: searchMode,
    engine: engineType,
    data: pokemons,
    typeResources: typeResources
  });

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
      const response = await axiosInstance.get('/api/pokedex/getAllPokemons/');
      pokemons.value = response.data;
    } catch (error) {
      console.error('Error loading pokemons:', error);
    } finally {
      loading.value = false;
    }
});

  const handleSearch = (query) => {
  searchState.searchQuery.value = query;
};

const handleFilterUpdate = (newFilters) => {
  searchState.updateFilters(newFilters);
}

const toggleFilterPanel = () => {
  isFilterOpen.value = !isFilterOpen.value;
};

const closeFilterPanel = () => {
  isFilterOpen.value = false;
};

  const goToPokemonDetail = (pokedexNumber) => {
    router.push(`/pokedex/details/${pokedexNumber}`);
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

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px 24px 0;
    overflow: auto;
    min-height: 0;
  }

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

  .pokemon-list-container {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 80px;
    padding-right: 4px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .pokemon-list-container::-webkit-scrollbar {
    display: none;
  }

  .pokemon-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 20px;
  }
</style>