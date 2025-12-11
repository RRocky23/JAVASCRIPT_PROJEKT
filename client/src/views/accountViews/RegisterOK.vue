<template>
  <div class="register-success">
    <div class="header">
      <button class="back-btn" @click="goBack" style="visibility: hidden;">‹</button>
      <div class="header-title">Create account</div>
      <div class="header-spacer"></div>
    </div>

    <div class="content">
      <div class="trainer-image">
        <img src="../../../public/register-success-trainer.png" alt="Trainer" />
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
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

.register-success {
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
  font-family: "Kode Mono", monospace;
  font-size: 1.2rem;
  font-weight: 600;
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
  font-family: "Kode Mono", monospace;
  font-size: 1.8rem;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 20px;
}

.description {
  font-family: "Kode Mono", monospace;
  font-size: 0.9rem;
  color: #444;
  line-height: 1.8;
  max-width: 500px;
  margin-bottom: 60px;
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

  .description {
    font-size: 1.5rem;
  }

  .cta-btn {
    width: 80%;
    font-size: 1.8rem;
    height: 70px;
  }
}
</style>