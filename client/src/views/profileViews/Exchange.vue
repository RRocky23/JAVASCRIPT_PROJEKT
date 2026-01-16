<template>
  <div class="exchange-page">
    <Header header-title="Exchange Pokemon"/>

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
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

.exchange-page {
  width: 100vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 24px 0;
  overflow: hidden;
}

.exchange-info {
  margin-bottom: 16px;
}

.info-text {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.selection-summary {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  font-family: "JetBrains Mono", monospace;
  font-weight: 600;
}

.selected-count {
  color: #333;
}

.total-value {
  color: #FFA500;
  font-size: 1.1rem;
}

.pokemon-list-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 80px;
  padding-right: 4px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.pokemon-list-container::-webkit-scrollbar {
  display: none;
}

.pokemon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
}

.pokemon-exchange-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.pokemon-exchange-card:hover {
  border-color: #FEC41B;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.pokemon-exchange-card.selected {
  border-color: #FEC41B;
  background: #FFFBF0;
  box-shadow: 0 4px 12px rgba(254, 196, 27, 0.2);
}

.pokemon-exchange-card.legendary {
  border-color: #FFD700;
}

.selection-checkbox {
  flex-shrink: 0;
}

.selection-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.pokemon-sprite {
  width: 60px;
  height: 60px;
  object-fit: contain;
  flex-shrink: 0;
}

.pokemon-info {
  flex: 1;
  min-width: 0;
}

.pokemon-name {
  font-family: "JetBrains Mono", monospace;
  font-weight: 700;
  font-size: 1rem;
  color: #333;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge {
  font-size: 0.9rem;
}

.badge.legendary {
  color: #FFD700;
}

.badge.mythical {
  color: #FF69B4;
}

.pokemon-details {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-badge {
  padding: 2px 8px;
  background: #E0E0E0;
  border-radius: 4px;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.pokemon-value {
  font-family: "JetBrains Mono", monospace;
  font-weight: 700;
  font-size: 1.1rem;
  color: #FFA500;
  flex-shrink: 0;
}

.exchange-actions {
  position: fixed;
  bottom: 70px;
  left: 0;
  right: 0;
  padding: 16px 24px;
  background: white;
  border-top: 2px solid #E0E0E0;
  display: flex;
  gap: 12px;
  z-index: 100;
}

.btn-cancel {
  flex: 1;
  padding: 14px;
  font-family: "JetBrains Mono", monospace;
  font-weight: 600;
  background: #E0E0E0;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #D0D0D0;
}

.btn-exchange {
  flex: 2;
  padding: 14px;
  font-family: "JetBrains Mono", monospace;
  font-weight: 600;
  background: #FEC41B;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-exchange:hover {
  background: #FFD700;
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 16px;
  max-width: 400px;
  margin: 0 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.modal-content h3 {
  font-family: "JetBrains Mono", monospace;
  font-size: 1.4rem;
  margin-bottom: 16px;
  color: #333;
}

.modal-content p {
  font-family: "JetBrains Mono", monospace;
  font-size: 1rem;
  margin-bottom: 16px;
  color: #666;
}

.warning-message {
  padding: 12px;
  background: #FFF3CD;
  border: 2px solid #FFD700;
  border-radius: 8px;
  color: #856404;
  font-family: "JetBrains Mono", monospace;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn-confirm {
  flex: 1;
  padding: 14px;
  font-family: "JetBrains Mono", monospace;
  font-weight: 600;
  background: #FEC41B;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm:hover:not(:disabled) {
  background: #FFD700;
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-content.success h3 {
  color: #28a745;
}

@media (max-width: 1024px) {
  .exchange-page {
    height: 100vh;
  }

  .exchange-actions {
    bottom: 80px;
  }
}
</style>
