<template>
  <div class="favourites-page">
    <Header header-title="Favourites" />

    <div class="content">
      <EmptyState v-if="!loading && favouritePokemons.length === 0" 
        image-url="/favourite-empty-substitute.png"
        empty-text="YOU DON'T HAVE ANY FAVOURITES YET. LET'S CHANGE THAT."
        button-route="/profile/myPokemons"
        button-text="Search for Pokemons" />

      <Spinner v-else-if="loading" />

      <div v-else class="pokemon-list-container">
        <div class="pokemon-list">
          <PokemonCard v-for="pokemon in favouritePokemons" 
            :key="pokemon.pokedexNumber" 
            :pokemon="pokemon" 
            :use-favourites="true" 
            @click="goToPokemonDetail(pokemon._id)"
            @toggle-favourite="toggleFavourite(pokemon._id)"/>
        </div>
      </div>

      <ConfirmFavouriteChange v-if="showConfirmBar" :count="pendingChanges.size" @cancel="cancelFavouriteChanges" @save="saveFavouriteChanges" />
    </div>

    <BottomNavigation />
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuth } from '../../composables/useAuth.js';
  import axiosInstance from '../../utils/axios.js';

  import Header from '../../components/common/Header.vue';
  import EmptyState from '../../components/common/EmptyState.vue';
  import Spinner from '../../components/common/Spinner.vue';
  import PokemonCard from '../../components/pokedex/PokemonCard.vue';
  import ConfirmFavouriteChange from '../../components/buttons/ConfirmFavouriteChange.vue';
  import BottomNavigation from './BottomNavigation.vue';

  const { fetchUser, isLoggedIn, refresh } = useAuth();
  const router = useRouter();
  const allPokemons = ref([]);
  const favorites = ref(JSON.parse(localStorage.getItem('favoritePokemons') || '[]'));
  const loading = ref(true);
  const pendingChanges = ref(new Map());
  const showConfirmBar = ref(false);

  const favouritePokemons = computed(() => {
    if(!Array.isArray(allPokemons.value)) {
      return [];
    }

    return allPokemons.value.filter((pokemon) => pokemon.isFavourite || pokemon.deletedFromFavourites)
      .map(pokemon => ({...pokemon, name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).toLowerCase()}));
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
        const response = await axiosInstance.get('/api/pokedex/getUserPokemons/');
        favorites.value = response.data.filter(p => p.isFavorite).map(p => p._id);

        allPokemons.value = response.data;

        localStorage.setItem("favoritePokemons", JSON.stringify(favorites))
      }catch(error) {
        console.error('Error loading pokemons:', error);
      }finally {
        loading.value = false;
      }
  });

  const goToPokemonDetail = (pokedexNumber) => {
    router.push(`/profile/myPokemons/${pokedexNumber}`);
  };

  const toggleFavourite = (pokemonId) => {
    const pokemon = allPokemons.value.find(p => p._id === pokemonId);
    if(!pokemon) {
      return;
    }

    if(pendingChanges.value.has(pokemonId)) {
      const { previous } = pendingChanges.value.get(pokemonId);
      
      if(pokemon.isFavourite === !previous) {
        pokemon.isFavourite = previous;
        pendingChanges.value.delete(pokemonId);
        delete pokemon.deletedFromFavourites;
      }
    } 
    else {
      const prev = pokemon.isFavourite;
      const newValue = !prev;
      pokemon.isFavourite = newValue;
      
      if(!newValue) {
        pokemon.deletedFromFavourites = true;
      }
      
      pendingChanges.value.set(pokemonId, { previous: prev, newValue });
    }
    
    showConfirmBar.value = pendingChanges.value.size > 0;
  };

  const cancelFavouriteChanges = () => {
    pendingChanges.value.forEach(({ previous }, pokemonId) => {
      const pokemon = allPokemons.value.find(p => p._id === pokemonId);
      if(!pokemon) {
        return;
      }
      
      pokemon.isFavourite = previous;
      delete pokemon.deletedFromFavourites;
    });

    pendingChanges.value.clear();
    showConfirmBar.value = false;
  };

  const saveFavouriteChanges = async () => {
    for(const [pokemonId, { newValue }] of pendingChanges.value) {
      const pokemon = allPokemons.value.find(p => p._id === pokemonId);
      if(!pokemon) {
        continue;
      }

      try {
        await axiosInstance.patch(`/api/pokedex/changePokemonFavoriteStatus/${pokemonId}/`, { isFavorite: newValue });

        if(newValue) {
          if(!favorites.value.includes(pokemonId)) favorites.value.push(pokemonId);
        } 
        else {
          favorites.value = favorites.value.filter(id => id !== pokemonId);
        }

        delete pokemon.deletedFromFavourites;

      }
      catch(error) {
        console.error("Failed to update favorite", error);
      }
    }

    localStorage.setItem('favoritePokemons', JSON.stringify(favorites.value));
    pendingChanges.value.clear();
    showConfirmBar.value = false;
  };
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

.favourites-page {
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