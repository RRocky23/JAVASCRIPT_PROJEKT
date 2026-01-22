<template>
  <div class="register-success">
    <div class="header">
      <button class="back-btn" @click="goBack" style="visibility: hidden;">‹</button>
      <div class="header-title">Create account</div>
      <div class="header-spacer"></div>
    </div>

    <div class="content">
      <div class="trainer-image">
        <img src="/register-success-trainer.png" alt="Trainer" />
      </div>

      <div class="title">Welcome Home!</div>

      <div class="description">
        YOUR ACCOUNT HAVE BEEN CREATED SUCCESSFULLY.<br />
        TAKE A LOOK AROUND AND HAVE FUN!
      </div>

      <button class="cta-btn" @click="goToLogin">
        Continue
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push('/account/login');
};

const goBack = () => {
  router.push('/account/register/username');
};
</script>

<style scoped>
@import '../client/src/styles/RegisterOKStyles.css';
</style>