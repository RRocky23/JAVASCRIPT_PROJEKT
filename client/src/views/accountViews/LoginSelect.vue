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
        <button class="btn btn-google" disabled>
          <span class="google-icon">G</span>
          Continue with google
        </button>
        <button class="cta-btn" @click="goToLoginForm">
          Continue with an e-mail
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

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

.btn-google {
  width: 328px;
  height: 58px;
  background-color: #fff;
  color: #FEC41B;
  border: 2px solid #FEC41B;
  border-radius: 6px;
  font-family: "Kode Mono", monospace;
  font-weight: 600;
  font-size: 18px;
  cursor: not-allowed;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0.6;
}

.google-icon {
  font-size: 20px;
  font-weight: bold;
}

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

.cta-btn:active {
  transform: translateY(2px);
  box-shadow:
    inset -3px 3px 0 #FFDA5D,
    inset 3px -3px 0 rgba(0,0,0,0.25);
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

  .btn-google,
  .cta-btn {
    width: 80%;
    font-size: 1.8rem;
    height: 70px;
  }
}
</style>