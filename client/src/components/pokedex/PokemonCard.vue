<template>
    <div class="pokemon-card" :style="{ backgroundColor: getPokemonColor(pokemon.color, isDiscovered) }" @click="emit('click')">
    
        <img v-if="isDiscovered" :src="pokemon.sprite" :alt="pokemon.name" class="pokemon-sprite" />
        <img v-else :style="undiscoveredMask" class="pokemon-sprite" />
            
        <div class="pokemon-info">
            <h3 v-if="isDiscovered" class="pokemon-name">{{ pokemon.name }}</h3>
            <h3 v-else class="pokemon-name">???</h3>
            
            <p class="pokemon-number">N°{{ String(pokemon.pokedexNumber).padStart(3, '0') }}</p>
              
            <div class="pokemon-types">
                <TypeBadge v-if="pokemon.typeOne" :type="pokemon.typeOne" :start-flipped="false" :is-discovered="isDiscovered" />
                <TypeBadge v-if="pokemon.typeTwo" :type="pokemon.typeTwo" :start-flipped="false" :is-discovered="isDiscovered"/>
            </div>
        </div>
        
        <ToggleFavoriteButton v-if="useFavourites" :pokemon-number="pokemon.pokedexNumber" :favorites="favorites" @update:favorites="updateFavorites" />

    </div>
</template>

<script setup>
    import { ref, computed } from "vue";
    import { getPokemonColor } from "../../utils/colors.js";

    import TypeBadge from "./TypeBadge.vue";
    import ToggleFavoriteButton from "../buttons/ToggleFavoriteButton.vue";

    const props = defineProps({
      pokemon: Object,
      useFavourites: { type: Boolean, default: false }
    });

    const favorites = ref(JSON.parse(localStorage.getItem('pokemonFavorites') || '[]'));
    const isDiscovered = false;
    const emit = defineEmits(["click"]);

    const maskBase = computed(() => ({
      maskImage: `url(${props.pokemon.sprite})`,
      WebkitMaskImage: `url(${props.pokemon.sprite})`,
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      maskPosition: "center",
      WebkitMaskPosition: "center"
    }));

    const undiscoveredMask = computed(() => ({
      ...maskBase.value,
      backgroundColor: "#444444"
    }));

    const updateFavorites = (newFavorites) => {
      favorites.value = newFavorites;
    };
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

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
