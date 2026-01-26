<template>
  <div class="pokemon-details-page" v-if="!loading">
    <div
      class="pokemon-header"
      :style="{
        backgroundColor: headerBackgroundColor,
        backgroundImage: headerBackgroundImage ? `url(${headerBackgroundImage})` : 'none'
      }"
    >
      <img
        :src="pokemonData.spriteURL"
        :alt="pokemonData.name"
        class="pokemon-sprite"
      />
      <div class="pokemon-info-header">
        <h2 class="pokemon-name">{{ capitalizedName }}</h2>
        <p class="pokemon-number">N°{{ formattedPokedexNumber }}</p>
      </div>
    </div>

    <div class="pokemon-tabs" v-if="pokemonData">
      <div class="tab-buttons">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="{ active: activeTab === tab }"
        >
          {{ tab }}
        </button>
      </div>

      <div class="tab-content">
        <AboutTab v-if="activeTab === 'About'" :pokemonData="pokemonData" />
        <StatsTab v-if="activeTab === 'Stats'" :pokemonData="pokemonData" />
        <MovesTab v-if="activeTab === 'Moves'" :pokemonData="pokemonData" />
        <EvolutionsTab v-if="activeTab === 'Evolutions'" :pokemonData="pokemonData" />
      </div>
    </div>

    <div v-if="!pokemonData && !loading">
      <p>Nie znaleziono pokemona</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '../../utils/axios.js';
import AboutTab from './AboutTab.vue';
import StatsTab from './StatsTab.vue';
import MovesTab from './MovesTab.vue';
import EvolutionsTab from './EvolutionsTab.vue';
import { getTypeBadgeColor } from '../../utils/colors.js';

const route = useRoute();
const pokemonId = route.params.pokemonId;

const pokemonData = ref(null);
const loading = ref(true);

const headerBackgroundColor = computed(() => {
  if (!pokemonData.value?.typeOne) return '#f5f5f5';
  return getTypeBadgeColor(pokemonData.value.typeOne);
});

const headerBackgroundImage = computed(() => {
  if (!pokemonData.value?.typeOne) return '';
  return `/types-white/${pokemonData.value.typeOne.toLowerCase()}.svg`;
});

const capitalizedName = computed(() => {
  if (!pokemonData.value?.name) return '';
  return pokemonData.value.name.charAt(0).toUpperCase() +
         pokemonData.value.name.slice(1);
});

const formattedPokedexNumber = computed(() => {
  if (!pokemonData.value?.pokedexNumber) return '';
  return String(pokemonData.value.pokedexNumber).padStart(3, '0');
});

const tabs = ['About', 'Stats', 'Moves', 'Evolutions'];
const activeTab = ref('About');

onMounted(async () => {
  try {
    const response = await axiosInstance.get(`/api/pokedex/getPokemon/${pokemonId}`);
    pokemonData.value = response.data;
    console.log("Pokemon data:", pokemonData.value);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@import "../client/src/styles/PokemonDetailsStyles.css";
</style>
