<template>
  <div v-if="isOpen" class="filter-overlay" @click="closeFilter">
    <div class="filter-panel" @click.stop>
      <div class="filter-header">
        <h2>Filters & Sort</h2>
        <button class="close-btn" @click="closeFilter">✕</button>
      </div>

      <div class="filter-content">
        <div class="filter-section">
          <h3>Sort By</h3>
          <div class="sort-options">
            <button 
              v-for="option in availableSortOptions" 
              :key="option.value"
              :class="['sort-btn', { active: localFilters.sortBy === option.value }]"
              @click="selectSort(option.value)" >
              {{ option.label }}
              <span v-if="localFilters.sortBy === option.value" class="sort-order">
                {{ localFilters.sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </button>
          </div>
        </div>

        <div class="filter-section">
          <h3>Type <span v-if="localFilters.types.length > 0" class="filter-count">({{ localFilters.types.length }})</span></h3>
          <div class="filter-actions">
            <button class="action-btn" @click="selectAllTypes">Select All</button>
            <button class="action-btn" @click="clearAllTypes">Clear</button>
          </div>
          <div class="type-grid">
            <button
              v-for="type in typeList"
              :key="type.name"
              :class="['type-btn', { active: localFilters.types.includes(type.name) }]"
              :style="{ '--type-color': type.color || '#888' }"
              @click="toggleType(type.name)" >
              <img :src="type.image" :alt="type.name" class="type-icon" />
              <span class="type-name">{{ type.name }}</span>
            </button>
          </div>
        </div>

        <div class="filter-section">
          <h3>Generation <span v-if="localFilters.generations.length > 0" class="filter-count">({{ localFilters.generations.length }})</span></h3>
          <div class="filter-actions">
            <button class="action-btn" @click="selectAllGenerations">Select All</button>
            <button class="action-btn" @click="clearAllGenerations">Clear</button>
          </div>
          <div class="generation-grid">
            <button v-for="gen in generations" :key="gen"
              :class="['gen-btn', { active: localFilters.generations.includes(gen) }]"
              @click="toggleGeneration(gen)" >
              Gen {{ gen }}
            </button>
          </div>
        </div>

        <div class="filter-section">
          <h3>Pokedex Number</h3>
          <div class="numeric-inputs">
            <input type="number" placeholder="Min #" v-model.number="localFilters.pokedexNumber.min" class="numeric-input" />
            <input type="number" placeholder="Max #" v-model.number="localFilters.pokedexNumber.max" class="numeric-input" />
          </div>
        </div>

        <div v-if="engine === 'pokemon_with_user'" class="filter-section">
          <h3>Level</h3>
          <div class="numeric-inputs">
            <input type="number" placeholder="Min Level" v-model.number="localFilters.level.min" class="numeric-input" min="1" max="100" />
            <input type="number" placeholder="Max Level" v-model.number="localFilters.level.max" class="numeric-input" min="1" max="100" />
          </div>

          <h3 style="margin-top: 16px;">Caught Date</h3>
          <div class="numeric-inputs">
            <input type="date" v-model="localFilters.caughtDateMin" class="numeric-input" />
            <input type="date" v-model="localFilters.caughtDateMax" class="numeric-input" />
          </div>
        </div>

        <div v-if="showDiscoveryFilter && engine === 'pokemon_only'" class="filter-section">
          <h3>Discovery Status</h3>
          <div class="toggle-group">
            <label class="toggle-option">
              <input type="radio" :checked="localFilters.discoveredOnly === null" @change="setDiscoveredFilter(null)" />
              <span>All</span>
            </label>
            <label class="toggle-option">
              <input type="radio" :checked="localFilters.discoveredOnly === true" @change="setDiscoveredFilter(true)" />
              <span>Discovered</span>
            </label>
            <label class="toggle-option">
              <input type="radio" :checked="localFilters.discoveredOnly === false" @change="setDiscoveredFilter(false)" />
              <span>Undiscovered</span>
            </label>
          </div>
        </div>

        <div v-if="showFavoriteFilter" class="filter-section">
          <h3>Favourites</h3>
          <div class="toggle-group">
            <label class="toggle-option">
              <input type="radio" :checked="localFilters.favorite === null" @change="setFavoriteFilter(null)" />
              <span>All</span>
            </label>
            <label class="toggle-option">
              <input type="radio" :checked="localFilters.favorite === true" @change="setFavoriteFilter(true)" />
              <span>Favourites Only</span>
            </label>
          </div>
        </div>

        <div v-if="hasActiveFilters" class="filter-section">
          <h3>Active Filters</h3>
          <div class="active-filters">
            <span v-if="localFilters.types.length > 0" class="filter-badge">
              {{ localFilters.types.length }} Type{{ localFilters.types.length > 1 ? 's' : '' }}
            </span>
            <span v-if="localFilters.generations.length > 0" class="filter-badge">
              {{ localFilters.generations.length }} Gen{{ localFilters.generations.length > 1 ? 's' : '' }}
            </span>
            <span v-if="hasNumericFilters" class="filter-badge">
              Numeric Filters
            </span>
            <span v-if="localFilters.discoveredOnly !== null" class="filter-badge">
              {{ localFilters.discoveredOnly ? 'Discovered' : 'Undiscovered' }}
            </span>
            <span v-if="localFilters.userOwned !== null" class="filter-badge">
              {{ localFilters.userOwned ? 'Owned' : 'Not Owned' }}
            </span>
            <span v-if="localFilters.favorite === true" class="filter-badge">
              Favorites
            </span>
          </div>
        </div>
      </div>

      <div class="filter-footer">
        <button class="reset-btn" @click="resetFilters">Reset All</button>
        <button class="apply-btn" @click="applyFilters">
          Apply Filters
          <span v-if="filterCount > 0" class="filter-count-badge">{{ filterCount }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  filters: {
    type: Object,
    required: true
  },
  typeResources: {
    type: Array,
    default: () => []
  },
  searchMode: {
    type: String,
    default: 'all_pokemons'
  },
  engine: {
    type: String,
    default: 'pokemon_only'
  }
});

const emit = defineEmits(['close', 'update:filters']);

const baseSortOptions = [
  { value: 'pokedexNumber', label: 'Pokedex #' },
  { value: 'name', label: 'Name' },
  { value: 'type', label: 'Type' },
  { value: 'generation', label: 'Generation' }
];

const userPokemonSortOptions = [
  { value: 'level', label: 'Level' },
  { value: 'caughtDate', label: 'Caught Date' }
];

const availableSortOptions = computed(() => {
  if (props.engine === 'pokemon_with_user') {
    return [...baseSortOptions, ...userPokemonSortOptions];
  }
  return baseSortOptions;
});

const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const localFilters = ref({ ...props.filters });

const typeList = computed(() => {
  if (props.typeResources && props.typeResources.length > 0) {
    return props.typeResources;
  }

  return [
    { name: 'Normal' }, { name: 'Fire' }, { name: 'Water' }, 
    { name: 'Electric' }, { name: 'Grass' }, { name: 'Ice' },
    { name: 'Fighting' }, { name: 'Poison' }, { name: 'Ground' }, 
    { name: 'Flying' }, { name: 'Psychic' }, { name: 'Bug' },
    { name: 'Rock' }, { name: 'Ghost' }, { name: 'Dragon' }, 
    { name: 'Dark' }, { name: 'Steel' }, { name: 'Fairy' }
  ];
});

const showDiscoveryFilter = computed(() => {
  return ['all_pokemons', 'user_pokemons'].includes(props.searchMode);
});

const showOwnershipFilter = computed(() => {
  return props.engine === 'pokemon_with_user' && 
         ['all_pokemons', 'discovered', 'undiscovered'].includes(props.searchMode);
});

const showFavoriteFilter = computed(() => {
  return props.engine === 'pokemon_with_user' &&
         ['all_pokemons', 'discovered', 'user_pokemons'].includes(props.searchMode);
});

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters };
}, { deep: true });

const hasNumericFilters = computed(() => {
  return (localFilters.value.pokedexNumber?.min !== null || 
          localFilters.value.pokedexNumber?.max !== null ||
          localFilters.value.height?.min !== null ||
          localFilters.value.height?.max !== null ||
          localFilters.value.weight?.min !== null ||
          localFilters.value.weight?.max !== null ||
          localFilters.value.level?.min !== null ||
          localFilters.value.level?.max !== null ||
          localFilters.value.caughtDateMin !== null ||
          localFilters.value.caughtDateMax !== null);
});

const hasActiveFilters = computed(() => {
  return localFilters.value.types.length > 0 || 
         localFilters.value.generations.length > 0 || 
         localFilters.value.discoveredOnly !== null ||
         localFilters.value.userOwned !== null ||
         localFilters.value.favorite !== null ||
         hasNumericFilters.value;
});

const filterCount = computed(() => {
  let count = 0;
  if (localFilters.value.types.length > 0) count += localFilters.value.types.length;
  if (localFilters.value.generations.length > 0) count += localFilters.value.generations.length;
  if (localFilters.value.discoveredOnly !== null) count += 1;
  if (localFilters.value.userOwned !== null) count += 1;
  if (localFilters.value.favorite !== null) count += 1;
  if (hasNumericFilters.value) count += 1;
  return count;
});

const selectSort = (sortBy) => {
  if (localFilters.value.sortBy === sortBy) {
    localFilters.value.sortOrder = localFilters.value.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    localFilters.value.sortBy = sortBy;
    localFilters.value.sortOrder = 'asc';
  }
};

const toggleType = (type) => {
  const index = localFilters.value.types.indexOf(type);
  if (index > -1) {
    localFilters.value.types.splice(index, 1);
  } else {
    localFilters.value.types.push(type);
  }
};

const selectAllTypes = () => {
  localFilters.value.types = typeList.value.map(t => t.name);
};

const clearAllTypes = () => {
  localFilters.value.types = [];
};

const toggleGeneration = (gen) => {
  const index = localFilters.value.generations.indexOf(gen);
  if (index > -1) {
    localFilters.value.generations.splice(index, 1);
  } else {
    localFilters.value.generations.push(gen);
  }
};

const selectAllGenerations = () => {
  localFilters.value.generations = [...generations];
};

const clearAllGenerations = () => {
  localFilters.value.generations = [];
};

const setDiscoveredFilter = (value) => {
  localFilters.value.discoveredOnly = value;
};


const setFavoriteFilter = (value) => {
  localFilters.value.favorite = value;
};

const resetFilters = () => {
  localFilters.value = {
    sortBy: 'pokedexNumber',
    sortOrder: 'asc',
    types: [],
    generations: [],
    discoveredOnly: null,
    userOwned: null,
    favorite: null,
    pokedexNumber: { min: null, max: null },
    level: { min: null, max: null },
    caughtDateMin: null,
    caughtDateMax: null
  };
};

const applyFilters = () => {
  emit('update:filters', { ...localFilters.value });
  emit('close');
};

const closeFilter = () => {
  emit('close');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.filter-panel {
  background-color: #fff;
  width: 100%;
  max-height: 85vh;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E0E0E0;
}

.filter-header h2 {
  font-family: "JetBrains Mono", monospace;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
}

.filter-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.filter-section {
  margin-bottom: 28px;
}

.filter-section h3 {
  font-family: "JetBrains Mono", monospace;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-count {
  font-size: 0.85rem;
  color: #FEC41B;
  font-weight: 600;
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.action-btn {
  padding: 6px 12px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8rem;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  background-color: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #F5F5F5;
}

.sort-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.sort-btn {
  padding: 12px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9rem;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.sort-btn.active {
  border-color: #FEC41B;
  background-color: #FFF9E6;
  font-weight: 600;
}

.sort-order {
  font-size: 1.2rem;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.type-btn {
  padding: 10px 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85rem;
  border: 2px solid #E0E0E0;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.type-btn.active {
  border-color: var(--type-color, #FEC41B);
  background-color: var(--type-color, #FEC41B);
  color: #fff;
  font-weight: 600;
}

.type-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.type-emoji {
  font-size: 1.5rem;
}

.type-name {
  font-size: 0.75rem;
}

.generation-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.gen-btn {
  padding: 10px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85rem;
  border: 2px solid #E0E0E0;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.gen-btn.active {
  border-color: #FEC41B;
  background-color: #FEC41B;
  color: #fff;
  font-weight: 600;
}

.preset-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preset-btn {
  padding: 12px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9rem;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.preset-btn:hover {
  border-color: #FEC41B;
  background-color: #FFF9E6;
}

.numeric-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;
}

.numeric-input {
  padding: 10px 12px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9rem;
  border: 2px solid #E0E0E0;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}

.numeric-input:focus {
  border-color: #FEC41B;
}

.toggle-group {
  display: flex;
  gap: 10px;
}

.toggle-option {
  flex: 1;
  padding: 12px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9rem;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.toggle-option input[type="radio"] {
  margin: 0;
}

.toggle-option input[type="radio"]:checked + span {
  font-weight: 600;
}

.toggle-option:has(input:checked) {
  border-color: #FEC41B;
  background-color: #FFF9E6;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-badge {
  padding: 6px 12px;
  background-color: #FFF9E6;
  border: 1px solid #FEC41B;
  border-radius: 16px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85rem;
  color: #333;
  font-weight: 500;
}

.filter-footer {
  padding: 16px 24px;
  border-top: 1px solid #E0E0E0;
  display: flex;
  gap: 12px;
}

.reset-btn, .apply-btn {
  flex: 1;
  padding: 14px;
  font-family: "JetBrains Mono", monospace;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn {
  background-color: #F5F5F5;
  color: #666;
}

.reset-btn:active {
  background-color: #E0E0E0;
}

.apply-btn {
  background-color: #FEC41B;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.apply-btn:active {
  background-color: #E5B018;
}

.filter-count-badge {
  background-color: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.85rem;
}
</style>