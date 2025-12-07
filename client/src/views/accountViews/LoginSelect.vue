<template>
  <div class="login-select">
    <header class="header">
      <button class="back-btn" @click="goBack">‹</button>
      <h1 class="header-title">Log In</h1>
      <div class="header-spacer"></div>
    </header>
    
    <div class="content">
      <div class="trainer-image">
        <img src="../../../public/login-welcome-trainer.png" alt="Trainer" />
      </div>
      
      <h2 class="title">Already a trainer?<br>Come on in!</h2>
      
      <div class="buttons">
        <button class="btn btn-google" disabled>
          <span class="google-icon">G</span>
          Continue with google
        </button>
        <button class="btn btn-primary" @click="goToLoginForm">
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
  background-color: #1A1A1A;
  flex-shrink: 0;
}

.back-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
}

.header-title {
  font-family: var(--font-pixel);
  font-size: 1.2rem;
  font-weight: 900;
  color: #fff;
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
  font-family: var(--font-pixel);
  font-size: 2rem;
  font-weight: 900;
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

.btn {
  width: 240px;
  padding: 14px 0;
  font-family: var(--font-pixel);
  font-size: 1rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s ease;
  text-align: center;
}

.btn-google {
  background-color: #fff;
  color: #ffd84d;
  border: 2px solid #ffd84d;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.google-icon {
  font-size: 20px;
  font-weight: bold;
}

.btn-primary {
  background-color: #ffd84d;
  color: #1A1A1A;
}

.btn-primary:hover {
  background-color: #eac14a;
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

  .btn {
    width: 80%;
    font-size: 1.8rem;
    padding: 18px 0;
    border-radius: 14px;
  }
}
</style>