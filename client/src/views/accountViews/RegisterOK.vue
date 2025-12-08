<template>
  <div class="register-success">
    <div class="header">
      <button class="back-btn" @click="goBack" style="visibility: hidden;">‹</button>
      <div class="header-title">Create account</div>
      <div class="header-spacer"></div>
    </div>

    <div class="content">
      <div class="trainer-image">
        <img src="../../../public/trainer-success.png" alt="Trainer" />
      </div>

      <div class="title">Welcome Home!</div>

      <div class="description">
        YOUR ACCOUNT HAVE BEEN CREATED SUCCESSFULLY.<br />
        TAKE A LOOK AROUND AND HAVE FUN!
      </div>

      <button class="btn btn-primary" @click="goToLogin">
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
}

.trainer-image {
  width: 200px;
  height: 200px;
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
  margin-bottom: 20px;
}

.description {
  font-family: var(--font-pixel);
  font-size: 1rem;
  color: #444;
  line-height: 1.8;
  max-width: 500px;
  margin-bottom: 60px;
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

  .description {
    font-size: 1.5rem;
  }

  .btn {
    width: 80%;
    font-size: 1.8rem;
    padding: 18px 0;
    border-radius: 14px;
  }
}
</style>


