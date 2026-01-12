<template>
  <div class="login-select">
    <header class="header">
      <button class="back-btn" @click="goBack">‹</button>
      <h1 class="header-title">Log In</h1>
      <div class="header-spacer"></div>
    </header>
    
    <div class="content">
      <div class="trainer-image">
        <img src="/login-welcome-trainer.png" alt="Trainer" />
      </div>
      
      <h2 class="title">Already a trainer?<br>Come on in!</h2>
      
      <div class="buttons">
        <DefaultButton button-route="/error" button-text="Continue with Google" :use-outline-style="true" :is-disabled="true" :use-google="true" />
        <DefaultButton button-route="/account/login/form" button-text="Continue with an e-mail" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import DefaultButton from '../../components/buttons/DefaultButton.vue';

const router = useRouter();

const goBack = () => {
  router.push('/starter/onboarding4');
};

const goToLoginForm = () => {
  router.push('/account/login/form');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

.login-select {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #fff;
  flex-shrink: 0;
}

.back-btn {
  font-family: "Press Start 2P", system-ui;
  background: none;
  border: none;
  color: #000;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 8px;
}

.header-title {
  font-family: "JetBrains Mono", monospace;
  font-size: 1.2rem;
  font-weight: 500;
  color: #000;
}

.header-spacer {
  width: 36px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
  overflow-y: auto;
}

.trainer-image {
  height: auto;
  max-height: 250px;
  margin-bottom: 40px;
}

.trainer-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

.title {
  font-family: "JetBrains Mono", monospace;
  font-size: 1.8rem;
  font-weight: 500;
  color: #1A1A1A;
  text-align: center;
  margin-bottom: 50px;
  line-height: 1.6;
}

.buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

@media (max-width: 1024px) {
  .trainer-image {
    width: 80%;
    height: auto;
    max-width: 260px;
  }

  .title {
    font-size: 2.5rem;
  }
}
</style>