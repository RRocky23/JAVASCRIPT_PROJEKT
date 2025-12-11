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

      <button class="cta-btn" @click="$router.push('/starter/onboarding4')">
        Continue
      </button>

    </div>

  </div>
</template>

<script setup>
</script>

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
  width: 100%;
  background: #f4b400;
  height: 100%;
}

@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

.cta-btn {
  width: 328px;
  height: 58px;

  background: #FEC41B;
  border: none;
  outline: none;
  border-radius: 6px;

  font-family: "Kode Mono", monospace;
  font-weight: 600;
  font-size: 18px;
  color: #FFFFFF;
  text-align: center;

  cursor: pointer;
  transition: 
    background 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.1s ease;

  box-shadow:
    inset -6px 6px 0 #FFDA5D,
    inset 6px -6px 0 rgba(0,0,0,0.25);
  
  display: flex;
  justify-content: center;
  align-items: center;
}

.cta-btn:hover {
  background: #e5b017;
}

/* --- efekt wciśnięcia --- */
.cta-btn:active {
  transform: translateY(2px);

  box-shadow:
    inset -3px 3px 0 #FFDA5D,
    inset 3px -3px 0 rgba(0,0,0,0.25);
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
