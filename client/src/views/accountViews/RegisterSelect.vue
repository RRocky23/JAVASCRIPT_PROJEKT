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
        <button class="btn btn-google" disabled>
          <span class="google-icon">G</span>
          Continue with Google
        </button>
        <router-link to="/account/register/email" class="btn btn-primary">
          Continue with an e-mail
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();
// Google OAuth 
</script>

<style scoped>

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
  font-size: 1.4rem;
  cursor: pointer;
  padding: 8px;
}

.header-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
}

.header-spacer {
  width: 36px;
}

.register-select {
  width: 100vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
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
  font-size: 2rem;
  font-weight: 900;
  color: #1A1A1A;
  margin-bottom: 50px;
  line-height: 1.4;
}

.buttons {
  width: 100%;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.btn {
  display: block;
  width: 100%;
  padding: 14px 0;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  text-align: center;
}

.btn-google {
  background-color: transparent;
  color: #ffd84d;
  border: 2px solid #ffd84d;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.google-icon {
  font-size: 1.3rem;
  font-weight: bold;
}

.btn-primary {
  background-color: #ffd84d;
  color: #1A1A1A;
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

  .btn {
    font-size: 1.8rem;
    padding: 20px 0;
    border-radius: 14px;
  }

  .buttons {
    max-width: 90%;
  }

  .google-icon {
    font-size: 2rem;
  }
}
</style>
