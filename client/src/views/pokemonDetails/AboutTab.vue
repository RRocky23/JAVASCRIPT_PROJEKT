<template>
  <!-- Typy pokemona -->
  <div class="about-item about-types" v-if="pokemonData.typeOne">
    <div class="types-container">
      <TypeTile
        :type="pokemonData.typeOne"
        :key="pokemonData.typeOne"
      />
      <TypeTile
        v-if="pokemonData.typeTwo"
        :type="pokemonData.typeTwo"
        :key="pokemonData.typeTwo"
      />
    </div>
  </div>

  <div class="about-grid" v-if="pokemonData">
    <div class="about-item about-item-max">
      <span class="value description">{{ pokemonData.description }}</span>
    </div>
  </div>
    <div class="about-grid" v-if="pokemonData">
    <div class="about-item">
      <span class="label">
        <img class="label-icon" src="/icons/pokemon-details/human-height-alt.svg" alt="Height" />
        Height
      </span>
      <span class="value">{{ formattedHeight }}</span>
    </div>

    <div class="about-item">
      <span class="label">
        <img class="label-icon" src="/icons/pokemon-details/anchor.svg" alt="Weight" />
        Weight
      </span>
      <span class="value">{{ pokemonData.weight }} kg</span>
    </div>

    <div class="about-item">
      <span class="label">
        <img class="label-icon" src="/icons/pokemon-details/script-text.svg" alt="Color" />
        Color
      </span>
      <span class="value">{{ pokemonData.color }}</span>
    </div>

    <div class="about-item">
      <span class="label">
        <img class="label-icon" src="/icons/pokemon-details/home.svg" alt="Habitat" />
        Habitat
      </span>
      <span class="value">{{ pokemonData.habitat }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import TypeTile from '../../components/common/TypeTile.vue';

const props = defineProps({
  pokemonData: {
    type: Object,
    required: true
  }
});

const formattedHeight = computed(() => {
  return `${(props.pokemonData.height / 10).toFixed(1)} m`;
});
</script>

<style scoped>
@import "../client/src/styles/PokemonDetailsStyles.css";
</style>
