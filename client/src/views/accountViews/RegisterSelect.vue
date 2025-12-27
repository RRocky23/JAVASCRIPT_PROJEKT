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
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

.register-select {
  width: 100vw;
  height: 80vh;
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
}

.trainer-image {
  width: auto;
  max-width: 250px;
  height: auto;
  margin-bottom: 40px;
}

.trainer-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.title {
  font-family: "JetBrains Mono", monospace;
  font-size: 1.8rem;
  font-weight: 500;
  color: #1A1A1A;
  margin-bottom: 50px;
  line-height: 1.4;
}

.buttons {
  width: 100%;
  max-width: 328px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

@media (max-width: 1024px) {
  .trainer-image {
    width: 80%;
    max-width: none;
  }

  .title {
    font-size: 2.6rem;
    margin-bottom: 60px;
  }

  .btn-google,
  .cta-btn {
    font-size: 1.8rem;
    height: 70px;
  }

  .buttons {
    max-width: 90%;
  }

  .google-icon {
    font-size: 2rem;
  }
}
</style>