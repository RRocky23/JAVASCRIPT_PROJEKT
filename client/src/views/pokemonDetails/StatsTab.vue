<template>
  <div class="stats-grid">
    <div
      class="stat-item"
      v-for="(value, key) in filteredStats"
      :key="key"
    >
      <span class="label">{{ formatStatName(key) }}</span>
      <span class="value">{{ value }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  pokemonData: Object
});

const filteredStats = computed(() => {
  if (!props.pokemonData?.stats) return {};
  const { _id, __v, ...rest } = props.pokemonData.stats;
  return rest;
});

const formatStatName = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase()); litery
};
</script>

<style scoped>
@import "../client/src/styles/PokemonDetailsStyles.css";
</style>
