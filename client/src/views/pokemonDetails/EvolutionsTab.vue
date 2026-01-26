<template>
  <div class="evolutions-tab">
    <div v-if="!chain || chain.length === 0">
      <p>No evolutions available.</p>
    </div>

    <div v-else class="evolution-list">
      <template v-for="(poke, index) in chain" :key="poke.pokedexNumber">
        <PokemonCard
          :pokemon="formatPokemonData(poke)"
          @click="goToPokemon(poke.pokedexNumber)"
        />
        
        <!-- strzałka + level, jeśli nie ostatni w chain -->
        <div v-if="index < chain.length - 1" class="evolution-step">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-down">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <polyline points="19 12 12 19 5 12"/>
          </svg>
          <span class="evolution-level">Lvl {{ chain[index + 1].evolutionMinLevel }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import PokemonCard from '../../components/pokedex/PokemonCard.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  pokemonData: Object
});

const router = useRouter();

const chain = props.pokemonData?.evolutions?.chain || [];

const formatPokemonData = (poke) => ({
  pokedexNumber: poke.pokedexNumber,
  name: poke.name,
  customName: poke.customName || null,
  sprite: poke.spriteURL,
  typeOne: poke.typeOne,
  typeTwo: poke.typeTwo,
  color: poke.color,
  discovered: true,
  deletedFromFavourites: false,
  owned: true,
  level: 1,
  isFavourite: false
});

const goToPokemon = (pokedexNumber) => {
  router.push(`/pokedex/details/${pokedexNumber}`);
};
</script>

<style scoped>
.evolution-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  align-items: center;
}

.evolution-step {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #000;
  opacity: 0.7;
  font-family: "JetBrains Mono", monospace;
  font-weight: 600;
}

.evolution-step svg {
  width: 24px;
  height: 24px;
}

.evolution-level {
  font-size: 0.9rem;
}
</style>
