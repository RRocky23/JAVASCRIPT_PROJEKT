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
@import '../client/src/styles/PokedexStyles.css';
</style>