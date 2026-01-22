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
@import '../client/src/styles/LoginSelectStyles.css';
</style>