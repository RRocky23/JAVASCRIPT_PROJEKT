<template>
  <div class="register-select">
    <div class="content">
      <div class="trainer-image">
        <img src="../../../public/trainer-welcome.png" alt="Trainer" />
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
// Możesz dodać logikę dla Google OAuth w przyszłości
</script>

<style scoped>
.register-select {
  width: 100vw;
  height: 100vh;
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
  width: 220px;
  max-width: 280px;
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
