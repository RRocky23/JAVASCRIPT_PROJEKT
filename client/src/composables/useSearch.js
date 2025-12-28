import { ref, computed } from 'vue';

const SEARCH_MODES = {
    ALL_POKEMONS: 'all_pokemons',
    USER_POKEMONS: 'user_pokemons',
    DISCOVERED: 'discovered',
    UNDISCOVERED: 'undiscovered',
    FAVORITES: 'favorites'
};

const SEARCH_ENGINES = {
    POKEMON_ONLY: 'pokemon_only',
    POKEMON_WITH_USER: 'pokemon_with_user'
};

export function useSearch(config = {}) {
  const {
      mode = SEARCH_MODES.ALL_POKEMONS,
      engine = SEARCH_ENGINES.POKEMON_ONLY,
      data = ref([]),
      typeResources = null
  } = config;

  const searchQuery = ref('');
  const filters = ref({
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
  });

  const parseSearchQuery = (query) => {
    const parsed = {};
    
    if(!query || !query.trim()) {
      return parsed;
    }
    
    const trimmedQuery = query.trim().toLowerCase();

    if(trimmedQuery.startsWith('showall')) {
      parsed.showAll = true;
      const afterShowAll = trimmedQuery.substring(7).trim();
      
      if(afterShowAll) {
        parsed.name = afterShowAll.split(',').map(n => n.trim()).filter(n => n);
      }

      return parsed;
    }

    parsed.name = trimmedQuery.split(',').map(n => n.trim()).filter(n => n);

    return parsed;
  };

  const inRange = (value, rangeFilter) => {
    if(value === undefined || value === null) {
      return true;
    }
    if(rangeFilter.min !== null && rangeFilter.min !== undefined && value < rangeFilter.min) {
      return false;
    }
    if(rangeFilter.max !== null && rangeFilter.max !== undefined && value > rangeFilter.max) {
      return false;
    }

    return true;
  };

  const matchesDateRange = (dateValue, minDate, maxDate) => {
    if(!dateValue) {
      return true;
    }
    
    const date = new Date(dateValue);
    
    if(minDate && date < new Date(minDate)) {
      return false;
    }
    
    if(maxDate && date > new Date(maxDate)) {
      return false;
    }
    return true;
  };

  const filterPokemons = (pokemons, searchCriteria, currentFilters) => {
    if(!Array.isArray(pokemons)) { 
      return [];
    }

    let filtered = [...pokemons];
    const isShowAll = searchCriteria.showAll === true;
    const hasNameSearch = searchCriteria.name && searchCriteria.name.length > 0;

    switch(mode) {
      case SEARCH_MODES.USER_POKEMONS:
        filtered = filtered.filter(p => p.userOwned === true);
        break;
      case SEARCH_MODES.DISCOVERED:
        filtered = filtered.filter(p => p.discovered === true);
        break;
      case SEARCH_MODES.UNDISCOVERED:
        filtered = filtered.filter(p => p.discovered === false);
        break;
      case SEARCH_MODES.FAVORITES:
        filtered = filtered.filter(p => p.isFavourite === true);
        break;
    }

    if(mode === SEARCH_MODES.ALL_POKEMONS || mode === SEARCH_MODES.USER_POKEMONS) {
      if(currentFilters.discoveredOnly === true) {
        filtered = filtered.filter(p => p.discovered === true);
      }else if (currentFilters.discoveredOnly === false) {
        filtered = filtered.filter(p => p.discovered === false);
      }
    }

    if(isShowAll) {
      filtered = filtered.map(p => ({ ...p, discovered: true }))
    }

    if(hasNameSearch) {
      filtered = filtered.filter(pokemon => {
        if(mode === SEARCH_MODES.ALL_POKEMONS && !isShowAll && !pokemon.discovered) {
          return false;
        }
        
        return searchCriteria.name.some(name => {
          if(engine === SEARCH_ENGINES.POKEMON_WITH_USER) {
            const customName = pokemon.customName?.toLowerCase() || '';
            const baseName = pokemon.name?.toLowerCase() || '';
            return customName.includes(name) || baseName.includes(name);
          }

          return pokemon.name.toLowerCase().includes(name);
        });
      });
    } 
    else if(!isShowAll) {
      if(mode === SEARCH_MODES.ALL_POKEMONS) {
      } 
      else {
        if(currentFilters.discoveredOnly === null) {
          filtered = filtered.filter(p => p.discovered);
        }
      }
    }


    if(currentFilters.types && currentFilters.types.length > 0) {
      filtered = filtered.filter(pokemon => {
        if(!pokemon.discovered) {
          return false;
        }

        const pokemonPrimaryType = pokemon.typeOne?.toLowerCase().trim() || '';
        const pokemonSecondaryType = pokemon.typeTwo?.toLowerCase().trim() || '';

        return currentFilters.types.some(filterType => {
          const normalizedFilterType = filterType.toLowerCase().trim();
          return (pokemonPrimaryType === normalizedFilterType || pokemonSecondaryType === normalizedFilterType);
        });
      });
    }

    if(currentFilters.generations && currentFilters.generations.length > 0) {
      filtered = filtered.filter(pokemon => currentFilters.generations.includes(pokemon.generation));
    }

    filtered = filtered.filter(pokemon =>
      inRange(pokemon.pokedexNumber, currentFilters.pokedexNumber)
    );

    if(engine === SEARCH_ENGINES.POKEMON_WITH_USER) {
      if(currentFilters.userOwned === true) {
        filtered = filtered.filter(p => p.userOwned === true);
      } 
      else if (currentFilters.userOwned === false) {
        filtered = filtered.filter(p => !p.userOwned);
      }

      if(currentFilters.favorite === true) {
        filtered = filtered.filter(p => p.isFavourite === true);
      }

      filtered = filtered.filter(pokemon => {
        const levelMatch = inRange(pokemon.level, currentFilters.level);
        const dateMatch = matchesDateRange(
          pokemon.caughtDate,
          currentFilters.caughtDateMin,
          currentFilters.caughtDateMax
        );
        
        return levelMatch && dateMatch;
      });
    }

    return filtered;
  };

  const sortPokemons = (pokemons, sortBy, sortOrder = 'asc') => {
    if(!Array.isArray(pokemons) || pokemons.length === 0) {
      return [];
    }
    
    return [...pokemons].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if(sortBy === 'type') {
        aVal = a.typeOne || '';
        bVal = b.typeOne || '';
      }

      if(aVal === null || aVal === undefined) {
        return 1;
      }
      if(bVal === null || bVal === undefined) {
        return -1;
      }

      if(typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.toLowerCase().localeCompare(bVal.toLowerCase());
        return sortOrder === 'asc' ? comparison : -comparison;
      }

      if(typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if(sortBy === 'caughtDate') {
        const dateA = aVal ? new Date(aVal).getTime() : 0;
        const dateB = bVal ? new Date(bVal).getTime() : 0;
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }

      return sortOrder === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
  };

  const capitalize = (str) => {
    if(!str) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const processedData = computed(() => {
    if(!Array.isArray(data.value)) {
      return [];
    }

    const searchCriteria = parseSearchQuery(searchQuery.value);
    let filtered = filterPokemons(data.value, searchCriteria, filters.value);
    filtered = sortPokemons(filtered, filters.value.sortBy, filters.value.sortOrder);

    return filtered.map(pokemon => ({ 
      ...pokemon, 
      name: capitalize(pokemon.name) 
    }));
  });

  const resetFilters = () => {
    filters.value = {
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

  const resetSearch = () => {
    searchQuery.value = '';
  };

  const resetAll = () => {
    resetSearch();
    resetFilters();
  };

  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  return {
    searchQuery,
    filters,
    processedData,
    mode,
    engine,
    typeResources,
    updateFilters,
    resetFilters,
    resetSearch,
    resetAll,
    parseSearchQuery,
    capitalize
  };
}

export { SEARCH_MODES, SEARCH_ENGINES };