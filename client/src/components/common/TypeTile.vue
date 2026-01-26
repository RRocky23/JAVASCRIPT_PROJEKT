<template>
  <div
    class="type-tile"
    :style="{ backgroundColor: backgroundColor }"
  >
    <div class="img-circle">
      <img
        class="type-icon"
        :src="`/types/${type.toLowerCase()}.png`"
        :alt="type"
      />
    </div>
    <span class="type-label">{{ type.toUpperCase() }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getTypeBadgeColor } from '../../utils/colors.js';

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  isDiscovered: {
    type: Boolean,
    default: true
  }
});

const backgroundColor = computed(() => getTypeBadgeColor(props.type, props.isDiscovered));
</script>

<style scoped>
.type-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 15px;
  cursor: default;
}

.img-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  padding: 5px;
}

.type-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  mix-blend-mode: multiply;
}

.type-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: black;
	font-family: "Kode Mono";
  text-transform: capitalize;
  text-align: center;
}
</style>
