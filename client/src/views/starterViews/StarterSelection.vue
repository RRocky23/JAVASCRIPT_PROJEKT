<template>
  <div class="starter-selection-wrapper">
    <div class="starter-container">
      <h1 class="title">Choose Your First Pokémon!</h1>
      <p class="subtitle">Select your starter companion for your adventure</p>

      <div class="starters-grid">
        <!-- Bulbasaur -->
        <div
          class="starter-card"
          :class="{ 'selected': selectedStarter === 'bulbasaur' }"
          @click="selectStarter('bulbasaur')"
        >
          <div class="pokemon-image">
            <img data-v-5838aa83="" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/1.png" alt="bulbasaur" class="pokemon-sprite">
            <!-- <img src="/pokemon/bulbasaur.png" alt="Bulbasaur" onerror="this.src='/placeholder-pokemon.png'"> -->
          </div>
          <h3 class="pokemon-name">Bulbasaur</h3>
          <p class="pokemon-type">
            <span class="type-badge grass">Grass</span>
            <span class="type-badge poison">Poison</span>
          </p>
          <p class="pokemon-description">
            A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.
          </p>
        </div>

        <!-- Charmander -->
        <div
          class="starter-card"
          :class="{ 'selected': selectedStarter === 'charmander' }"
          @click="selectStarter('charmander')"
        >
          <div class="pokemon-image">
            <!-- <img src="/pokemon/charmander.png" alt="Charmander" onerror="this.src='/placeholder-pokemon.png'"> -->
            <img data-v-5838aa83="" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/4.png" alt="charmander" class="pokemon-sprite">
          </div>
          <h3 class="pokemon-name">Charmander</h3>
          <p class="pokemon-type">
            <span class="type-badge fire">Fire</span>
          </p>
          <p class="pokemon-description">
            Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.
          </p>
        </div>

        <!-- Squirtle -->
        <div
          class="starter-card"
          :class="{ 'selected': selectedStarter === 'squirtle' }"
          @click="selectStarter('squirtle')"
        >
          <div class="pokemon-image">
            <img data-v-5838aa83="" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/7.png" alt="squirtle" class="pokemon-sprite">
            <!-- <img src="/pokemon/squirtle.png" alt="Squirtle" onerror="this.src='/placeholder-pokemon.png'"> -->
          </div>
          <h3 class="pokemon-name">Squirtle</h3>
          <p class="pokemon-type">
            <span class="type-badge water">Water</span>
          </p>
          <p class="pokemon-description">
            After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.
          </p>
        </div>
      </div>

      <div class="button-container">
        <button
          class="confirm-button"
          :disabled="!selectedStarter || isLoading"
          @click="confirmSelection"
        >
          {{ isLoading ? 'Loading...' : 'Confirm Selection' }}
        </button>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>🎉 Congratulations!</h2>
          <p>{{ successMessage }}</p>
          <p class="items-received">You also received 5× Poké Ball!</p>
          <button class="modal-button" @click="proceedToHome">Continue Adventure!</button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedStarter = ref(null);
const isLoading = ref(false);
const showSuccessModal = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const selectStarter = (starter) => {
  selectedStarter.value = starter;
  errorMessage.value = '';
};

const confirmSelection = async () => {
  if (!selectedStarter.value) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch('/api/profile/select-starter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ starter: selectedStarter.value })
    });

    const data = await response.json();

    if (response.ok) {
      successMessage.value = data.message;
      showSuccessModal.value = true;
    } else {
      errorMessage.value = data.message || 'Failed to select starter Pokémon';
    }
  } catch (error) {
    console.error('Error selecting starter:', error);
    errorMessage.value = 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  showSuccessModal.value = false;
  proceedToHome();
};

const proceedToHome = async () => {
  try {
    await fetch('/api/profile/complete-tutorial', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Error completing tutorial:', error);
  }

  router.push('/home');
};
</script>

<style scoped>
@import '../client/src/styles/StarterSelectionStyles.css';
</style>
