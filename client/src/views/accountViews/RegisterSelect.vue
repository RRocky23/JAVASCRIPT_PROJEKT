<template>
  <div class="register-select">
    <div class="header">
      <button class="back-btn" @click="router.push('/starter/onboarding4')">‹</button>
      <div class="header-title">Create account</div>
      <div class="header-spacer"></div>
    </div>

    <div class="content">
      <div class="trainer-image">
        <img src="/onboarding-adventure.png" alt="Adventure" />
      </div>

      <div class="title">
        Ready for a real<br />adventure? Let's go!
      </div>

      <div class="buttons">
        <DefaultButton button-route="/error" button-text="Continue with Google" :use-outline-style="true" :is-disabled="true" :use-google="true" />
        <DefaultButton button-route="/account/register/email" button-text="Continue with an e-mail" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

import DefaultButton from '../../components/buttons/DefaultButton.vue';

const router = useRouter();
</script>

<style scoped>
@import '../client/src/styles/RegisterSelectStyles.css';
</style>