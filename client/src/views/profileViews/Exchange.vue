<template>
  <div class="exchange-page">
    <Header header-title="Exchange Pokemon"/>
    <div class="top-currency">
      <span class="currency-icon">💰</span>
      <span class="currency-amount">{{ currency }}</span>
    </div>

    <div class="content">
      <EmptyState v-if="!loading && pokemons.length === 0"
        image-url="/favourite-empty-substitute.png"
        empty-text="YOU DON'T HAVE ANY POKEMONS TO EXCHANGE."
        button-route="/home"
        button-text="Catch some Pokemons" />

      <div v-if="!loading && pokemons.length > 0" class="exchange-info">
        <p class="info-text">Select Pokemon to exchange for currency</p>
        <div class="selection-summary">
          <span class="selected-count">Selected: {{ selectedPokemons.size }}</span>
          <span class="total-value">Value: {{ totalValue }} 💰</span>
        </div>
      </div>

      <Spinner v-if="loading" />

      <div v-else class="pokemon-list-container">
        <div class="pokemon-list">
          <div
            v-for="pokemon in pokemons"
            :key="pokemon._id"
            :class="['pokemon-exchange-card', {
              'selected': selectedPokemons.has(pokemon._id),
              'legendary': pokemon.isLegendary || pokemon.isMythical
            }]"
            @click="toggleSelection(pokemon._id)">

            <div class="selection-checkbox">
              <input
                type="checkbox"
                :checked="selectedPokemons.has(pokemon._id)"
                @click.stop="toggleSelection(pokemon._id)"
              />
            </div>

            <img
              :src="pokemon.sprite || '/placeholder-pokemon.png'"
              :alt="pokemon.name"
              class="pokemon-sprite"
            />

            <div class="pokemon-info">
              <div class="pokemon-name">
                {{ pokemon.customName || pokemon.name }}
                <span v-if="pokemon.isLegendary" class="badge legendary">⭐</span>
                <span v-if="pokemon.isMythical" class="badge mythical">✨</span>
              </div>
              <div class="pokemon-details">
                Level {{ pokemon.level }}
                <span v-if="pokemon.typeOne" class="type-badge">{{ pokemon.typeOne }}</span>
              </div>
            </div>

            <div class="pokemon-value">
              {{ pokemon.exchangeValue }} 💰
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedPokemons.size > 0" class="exchange-actions">
        <button class="btn-cancel" @click="clearSelection">Cancel</button>
        <button class="btn-exchange" @click="showConfirmModal = true">
          Exchange {{ selectedPokemons.size }} Pokemon
        </button>
      </div>
    </div>

    <BottomNavigation/>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="showConfirmModal = false">
      <div class="modal-content" @click.stop>
        <h3>Confirm Exchange</h3>
        <p>Are you sure you want to exchange <strong>{{ selectedPokemons.size }}</strong> Pokemon for <strong>{{ totalValue }} 💰</strong>?</p>

        <div v-if="hasLegendary" class="warning-message">
          ⚠️ Warning: You are about to exchange legendary or mythical Pokemon!
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="showConfirmModal = false">Cancel</button>
          <button class="btn-confirm" @click="confirmExchange" :disabled="exchanging">
            {{ exchanging ? 'Exchanging...' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
      <div class="modal-content success" @click.stop>
        <h3>✅ Exchange Successful!</h3>
        <p>You received <strong>{{ lastExchangeValue }} 💰</strong></p>
        <p>New balance: <strong>{{ newBalance }} 💰</strong></p>
        <button class="btn-confirm" @click="closeSuccessModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth.js';
import { useCurrency } from '../../composables/useCurrency.js';
import axiosInstance from '../../utils/axios.js';

import Header from '../../components/common/Header.vue';
import EmptyState from '../../components/common/EmptyState.vue';
import Spinner from '../../components/common/Spinner.vue';
import BottomNavigation from './BottomNavigation.vue';

const { isLoggedIn } = useAuth();
const { updateCurrency } = useCurrency();
const router = useRouter();

const pokemons = ref([]);
const selectedPokemons = ref(new Set());
const loading = ref(true);
const showConfirmModal = ref(false);
const showSuccessModal = ref(false);
const exchanging = ref(false);
const lastExchangeValue = ref(0);
const newBalance = ref(0);
const { currency } = useCurrency();

const totalValue = computed(() => {
  return Array.from(selectedPokemons.value)
    .reduce((sum, id) => {
      const pokemon = pokemons.value.find(p => p._id === id);
      return sum + (pokemon?.exchangeValue || 0);
    }, 0);
});

const hasLegendary = computed(() => {
  return Array.from(selectedPokemons.value).some(id => {
    const pokemon = pokemons.value.find(p => p._id === id);
    return pokemon?.isLegendary || pokemon?.isMythical;
  });
});

onMounted(async () => {
  if (!isLoggedIn.value) {
    router.push('/starter/onboarding4');
    return;
  }

  try {
    const response = await axiosInstance.get('/api/exchange/pokemons');
    pokemons.value = response.data;
  } catch (error) {
    console.error('Error loading exchangeable Pokemon:', error);
  } finally {
    loading.value = false;
  }
});

const toggleSelection = (pokemonId) => {
  if (selectedPokemons.value.has(pokemonId)) {
    selectedPokemons.value.delete(pokemonId);
  } else {
    selectedPokemons.value.add(pokemonId);
  }
  // Trigger reactivity
  selectedPokemons.value = new Set(selectedPokemons.value);
};

const clearSelection = () => {
  selectedPokemons.value.clear();
  selectedPokemons.value = new Set();
};

const confirmExchange = async () => {
  exchanging.value = true;

  try {
    const pokemonIds = Array.from(selectedPokemons.value);
    const response = await axiosInstance.post('/api/exchange/exchange', {
      pokemonIds
    });

    if (response.data.success) {
      lastExchangeValue.value = response.data.totalValue;
      newBalance.value = response.data.newBalance;

      // Update currency in the app
      updateCurrency(response.data.newBalance);

      // Remove exchanged Pokemon from list
      pokemons.value = pokemons.value.filter(p => !selectedPokemons.value.has(p._id));

      // Clear selection
      clearSelection();

      // Show success modal
      showConfirmModal.value = false;
      showSuccessModal.value = true;
    }
  } catch (error) {
    console.error('Error exchanging Pokemon:', error);
    alert('Failed to exchange Pokemon. Please try again.');
  } finally {
    exchanging.value = false;
  }
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
};
</script>

<style scoped>
@import '../client/src/styles/ExchangeStyles.css';
</style>
