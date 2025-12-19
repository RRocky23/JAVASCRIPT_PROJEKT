<template>
    <div class="pokedex-page">
        <div class="header">
            <div class="header-spacer"></div>
            <div class="header-title">My pokemons</div>
            <div class="header-spacer"></div>
        </div>

        <div class="content">
            <div v-if="!loading && filteredPokemons.length === 0" class="empty-state">
              <img src="/favourite-empty-substitute.png" alt="Empty" class="empty-image" />
              <h2 class="empty-title">Oops!</h2>
              <p class="empty-text">YOU DON'T HAVE ANY POKEMONS YET. LET'S CHANGE THAT.</p>
              <button class="cta-btn" @click="$router.push('/home')">
                  Catch some Pokemons
              </button>
            </div>

            <div v-if="!loading && filteredPokemons.length !== 0" class="search-container">
                <input v-model="searchQuery" type="text" class="search-input" placeholder="Name of the Pokemon" @input="handleSearch"/>
                <button class="filter-btn">☰</button>
            </div>

            <div v-if="loading" class="loading-state">
                <div class="spinner"></div>
            </div>

            <div v-else class="pokemon-list-container">
                <div class="pokemon-list">
                    <PokemonCard v-for="pokemon in filteredPokemons" 
                    :key="pokemon.pokedexNumber" 
                    :pokemon="pokemon" 
                    :use-favourites="true" 
                    @click="goToPokemonDetail(pokemon._id)"
                    @toggle-favorite="toggleFavorite(pokemon._id)"/>
                </div>
            </div>
        </div>
        <BottomNavigation/>
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
  const favorites = ref(JSON.parse(localStorage.getItem('favoritePokemons') || "[]"));
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
      const response = await axiosInstance.get('/api/pokedex/getUserPokemons/');
      favorites.value = response.data.filter(p => p.isFavorite).map(p => p._id);

      pokemons.value = response.data;

      localStorage.setItem("favoritePokemons", JSON.stringify(favorites))
    }catch(error) {
      console.error('Error loading pokemons:', error);
    } finally {
      loading.value = false;
    }
});

  const filteredPokemons = computed(() => {
    if(!Array.isArray(pokemons.value)) {
      return [];
    }

    const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    if(!searchQuery.value) {
      return pokemons.value.map((pokemon) => ({
        ...pokemon,
        name: capitalize(pokemon.name),
      }));
    }

    if(searchQuery.value.startsWith("showAll")) {
      const parts = searchQuery.value.split("-");
      const actualQuery = parts[1] ? parts[1].toLowerCase() : "";

    return pokemons.value.filter((pokemon) => actualQuery ? pokemon.name.toLowerCase().includes(actualQuery) : true)
      .map((pokemon) => ({
        ...pokemon,
        name: capitalize(pokemon.name),
        discovered: true
      }));
  }

    return pokemons.value.filter((pokemon) => pokemon.discovered)
    .filter((pokemon) => pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .map((pokemon) => ({ ...pokemon, name: capitalize(pokemon.name) }));
  });

  const handleSearch = () => {

  };

  const goToPokemonDetail = (pokedexNumber) => {
    router.push(`/profile/myPokemons/details/${pokedexNumber}`);
  };

  const toggleFavorite = async (pokemonId) => {
    const pokemon = pokemons.value.find(p => p._id === pokemonId);

    if(!pokemon) {
      return;
    }

    pokemon.isFavourite = !pokemon.isFavourite;

    try {
      await axiosInstance.patch(`/api/pokedex/changePokemonFavoriteStatus/${pokemonId}/`, { isFavorite: pokemon.isFavourite });
    }catch(error) {
      pokemon.isFavourite = !pokemon.isFavourite;
      console.error("Failed to update favorite", error);
    }

    if(pokemon.isFavourite) {
      favorites.value.push(pokemonId);
      pokemon.deletedFromFavourites = false;
    }
    else {
      favorites.value = favorites.value.filter(_id => _id !== pokemonId);
      pokemon.deletedFromFavourites = true;
    }

    localStorage.setItem('favoritePokemons', JSON.stringify(favorites.value));
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

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px 24px 0;
    overflow: hidden;
  }

  .empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
}

.empty-image {
  width: 200px;
  height: 200px;
  margin-bottom: 30px;
  image-rendering: pixelated;
}

.empty-title {
  font-family: "JetBrains Mono", monospace;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1A1A1A;
}

.empty-text {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 30px 0;
  max-width: 300px;
}

.cta-btn {
  width: 100%;
  max-width: 300px;
  height: 58px;
  background: #FEC41B;
  border: none;
  border-radius: 6px;
  font-family: "JetBrains Mono", monospace;
  font-weight: 600;
  font-size: 1rem;
  color: #FFFFFF;
  cursor: pointer;
  box-shadow:
    inset -6px 6px 0 #FFDA5D,
    inset 6px -6px 0 rgba(0,0,0,0.25);
  transition: 
    background 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.1s ease;
}

.cta-btn:hover {
  background: #e5b017;
}

.cta-btn:active {
  transform: translateY(2px);
  box-shadow:
    inset -3px 3px 0 #FFDA5D,
    inset 3px -3px 0 rgba(0,0,0,0.25);
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