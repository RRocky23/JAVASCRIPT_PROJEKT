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
  // Mark tutorial as complete
  try {
    await fetch('/api/profile/complete-tutorial', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Error completing tutorial:', error);
  }

  // Navigate to home
  router.push('/home');
};
</script>

<style scoped>
.starter-selection-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.starter-container {
  max-width: 1200px;
  width: 100%;
  text-align: center;
}

.title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  font-size: 1.2rem;
  color: #f0f0f0;
  margin-bottom: 40px;
}

.starters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.starter-card {
  background: white;
  border-radius: 16px;
  padding: 30px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 4px solid transparent;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.starter-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}

.starter-card.selected {
  border-color: #FEC41B;
  background: #fffef0;
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(254, 196, 27, 0.4);
}

.pokemon-image {
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pokemon-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.pokemon-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.pokemon-type {
  margin-bottom: 15px;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.type-badge.grass {
  background: #78C850;
}

.type-badge.poison {
  background: #A040A0;
}

.type-badge.fire {
  background: #F08030;
}

.type-badge.water {
  background: #6890F0;
}

.pokemon-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  min-height: 60px;
}

.button-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.confirm-button {
  background: #FEC41B;
  color: white;
  border: none;
  padding: 18px 60px;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow:
    inset -6px 6px 0 #FFDA5D,
    inset 6px -6px 0 rgba(0,0,0,0.25);
}

.confirm-button:hover:not(:disabled) {
  background: #e0b017;
  transform: translateY(-2px);
}

.confirm-button:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow:
    inset -3px 3px 0 #FFDA5D,
    inset 3px -3px 0 rgba(0,0,0,0.25);
}

.confirm-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.6;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  background: #ff4444;
  color: white;
  border-radius: 8px;
  font-weight: 600;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 40px;
  border-radius: 16px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.modal-content h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.modal-content p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 15px;
}

.items-received {
  font-weight: 700;
  color: #FEC41B;
}

.modal-button {
  background: #FEC41B;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.2s ease;
}

.modal-button:hover {
  background: #e0b017;
  transform: translateY(-2px);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .starters-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .confirm-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
