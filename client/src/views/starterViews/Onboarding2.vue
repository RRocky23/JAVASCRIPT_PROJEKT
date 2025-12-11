<template>
  <div class="welcome-wrapper">

    <div class="welcome-container">

      <img class="welcome-image" src="/onboarding-girls.png" alt="Girls">

      <h2 class="title">Unlock dozens of new<br>Pokemon Trainers</h2>

      <p class="subtitle">
        EACH CHARACTER HAS ITS UNIQUE TRAITS<br>
        THAT HELP IN BATTLE!
      </p>
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
}

</style>
