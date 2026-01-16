<template>
  <div class="search-wrapper">
    <div class="search-container">
      <input v-model="pokemonSearchQuery" type="text" class="search-input" :placeholder="placeholder"/>
      <button class="filter-btn" @click="toggleFilter">☰</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  searchQuery: { type: String, default: '' },
  placeholder: { type: String, default: 'Search Pokemon' }
});

const emit = defineEmits(['update:searchQuery', 'search', 'toggleFilter']);
const pokemonSearchQuery = ref(props.searchQuery);
let debounceTimeout = null;

watch(() => props.searchQuery, (newVal) => {
  pokemonSearchQuery.value = newVal;
});

watch(pokemonSearchQuery, (newVal) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    emit('update:searchQuery', newVal);
    emit('search', newVal);
  }, 100);
});

const toggleFilter = () => {
  emit('toggleFilter');
};
</script>


<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

    .search-wrapper {
        margin-bottom: 20px;
        flex-shrink: 0;
    }

    .search-container {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
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
        transition: background-color 0.2s;
    }

    .filter-btn:hover {
        background-color: #E5B018;
    }

    .filter-btn:active {
        background-color: #CC9D15;
    }

    .search-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
    }

    .search-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px;
        background-color: #FFF9E6;
        border: 1px solid #FEC41B;
        border-radius: 16px;
        font-family: "JetBrains Mono", monospace;
        font-size: 0.85rem;
    }

    .tag-label {
        font-weight: 600;
        color: #CC9D15;
    }

    .tag-value {
        color: #333;
    }

    .tag-remove {
        background: none;
        border: none;
        color: #CC9D15;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
        padding: 0;
        margin-left: 2px;
        line-height: 1;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tag-remove:hover {
        color: #000;
    }

    .clear-all-btn {
        padding: 6px 12px;
        background-color: #F5F5F5;
        border: 1px solid #E0E0E0;
        border-radius: 16px;
        font-family: "JetBrains Mono", monospace;
        font-size: 0.85rem;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;
    }

    .clear-all-btn:hover {
        background-color: #E0E0E0;
        color: #333;
    }
</style>