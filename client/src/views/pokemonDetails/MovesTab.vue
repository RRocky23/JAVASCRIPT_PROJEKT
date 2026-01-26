<template>
  <div class="moves-list">
    <div v-for="move in pokemonData.moves" :key="move.moveName" class="move-item">
      <span class="move-name">{{ move.moveName }}</span>
      <span class="move-info">{{ move.moveType }} | Power: {{ move.power }} | PP: {{ move.pp }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pokemonData: Object
});
</script>

<style scoped>
.moves-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.move-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.move-name {
  font-weight: 700;
  font-size: 1rem;
}

.move-info {
  font-size: 0.85rem;
  color: #666;
}
</style>
