<template>
    <div class="pokemon-card" :style="{ backgroundColor: getPokemonColor(pokemon.color, pokemon.discovered, pokemon.deletedFromFavourites) }" @click="emit('click')">
    
        <img v-if="pokemon.discovered" :src="pokemon.sprite" :alt="pokemon.name" class="pokemon-sprite" />
        <img v-else :style="undiscoveredMask" class="pokemon-sprite" />
            
        <div class="pokemon-info">
            <h3 v-if="pokemon.owned && pokemon.customName != null" class="pokemon-name"> {{ pokemon.customName }}</h3>
            <h3 v-else-if="pokemon.discovered" class="pokemon-name">{{ pokemon.name }}</h3>
            <h3 v-else class="pokemon-name">???</h3>
            <div class="pokemon-meta">
              <p class="pokemon-number">N°{{ String(pokemon.pokedexNumber).padStart(3, '0') }}</p>
              <p v-if="pokemon.owned" class="pokemon-number">Lvl. {{ pokemon.level }}</p>
            </div>
            <div class="pokemon-types">
                <TypeBadge v-if="pokemon.typeOne" :type="pokemon.typeOne" :start-flipped="false" :is-discovered="pokemon.discovered" />
                <TypeBadge v-if="pokemon.typeTwo" :type="pokemon.typeTwo" :start-flipped="false" :is-discovered="pokemon.discovered"/>
            </div>
        </div>
        
        <ToggleFavoriteButton v-if="useFavourites && pokemon.owned" :user-pokemon-id="pokemon._id" :is-favourite="pokemon.isFavourite" @toggle="emit('toggle-favourite', $event)" />

    </div>
</template>

<script setup>
    import { computed } from "vue";
    import { getPokemonColor } from "../../utils/colors.js";

    import TypeBadge from "./TypeBadge.vue";
    import ToggleFavoriteButton from "../buttons/ToggleFavoriteButton.vue";

    const props = defineProps({
      pokemon: Object,
      useFavourites: { type: Boolean, default: false }
    });

    const emit = defineEmits(["click", "toggle-favourite"]);
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
  overflow: hidden;
}

.pokemon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pokemon-sprite {
  width: 140px;
  height: 140px;
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

.pokemon-meta {
  display: flex;
  gap: 8px;
  align-items: center;
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

@media (max-width: 768px) {
  .pokemon-card {
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
  }

  .pokemon-sprite {
    width: 100%;
    height: 220px;
    object-fit: cover;
    margin-right: 0;
  }

  .pokemon-info {
    padding-top: 12px;
    text-align: left;
  }

  .pokemon-name {
    font-size: 1.3rem;
  }

  .pokemon-number {
    font-size: 0.95rem;
  }

  .type-badge {
    font-size: 0.85rem;
    padding: 6px 10px;
  }

  .favorite-btn {
    top: 10px;
    right: 10px;
    width: 46px;
    height: 46px;
    padding: 6px;
  }
}
</style>
