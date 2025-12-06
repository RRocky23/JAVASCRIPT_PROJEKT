<template>
  <div class="welcome-wrapper">

    <div class="welcome-container">

      <img class="welcome-image" src="/onboarding-pokegirls.png" alt="PokeGirls">

      <h2 class="title">Explore an incredible<br>world of Pokemons</h2>

      <p class="subtitle">
        A NOSTALGIC JOURNEY STRAIGHT<br>
        BACK TO YOUR CHILDHOOD
      </p>

      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>

      <button class="continue-btn" @click="$router.push('/starter/onboarding4')">
        Continue
      </button>

    </div>

  </div>
</template>

<style scoped>
/* ----- DESKTOP (default) ----- */
.welcome-container {
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-image {
  width: auto;
  max-width: 80%;
}

.title {
  font-size: 1.8rem;
  font-weight: 900;
  margin-top: 15px;
}

.subtitle {
  font-size: 0.9rem;
  max-width: 300px;
  color: #444;
  line-height: 1.3rem;
  margin-top: 10px;
}

.progress-bar {
  width: 60%;
  height: 14px;
  background: #eee;
  border-radius: 8px;
  margin: 20px 0;
  overflow: hidden;
}

.progress-fill {
  width: 95%;
  background: #f4b400;
  height: 100%;
}

.continue-btn {
  background-color: #ffd84d;
  padding: 12px 40px;
  border-radius: 10px;
  border: none;
  font-weight: bold;
  font-size: 1rem;
}

/* ----- MOBILE MODE ----- */
@media (max-width: 1024px) {

  .welcome-container {
    padding: 30% 20px !important;
    width: 100vw;
    height: 100vh;
    font-size: 1.3rem !important;
  }

  .welcome-image {
    width: 90% !important;
    max-width: none !important;
  }

  .title {
    font-size: 2.6rem !important;
    line-height: 3rem !important;
  }

  .subtitle {
    font-size: 1.5rem !important;
    line-height: 2rem !important;
    max-width: 90% !important;
  }

  .progress-bar {
    width: 80% !important;
    height: 24px !important;
    border-radius: 12px !important;
  }

  .continue-btn {
    width: 85% !important;
    padding: 20px !important;
    font-size: 2rem !important;
    border-radius: 14px !important;
  }
}

</style>
