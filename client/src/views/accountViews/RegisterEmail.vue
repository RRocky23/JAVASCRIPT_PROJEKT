<template>
  <div class="register-email">
    <div class="header">
      <button class="back-btn" @click="router.push('/account/register')">‹</button>
      <div class="header-title">Create account</div>
      <div class="header-spacer"></div>
    </div>

    <div class="content">
      <div class="title">
        What is your email<br />address?
      </div>

      <form class="form" @submit.prevent="handleContinue">
        <div 
          class="input-group" 
          :class="{ 
            focused: isFocused, 
            valid: isAvailable, 
            error: hasError,
            checking: isChecking 
          }"
        >
          <input
            v-model="email"
            type="email"
            placeholder="E-mail"
            @focus="isFocused = true"
            @blur="isFocused = false"
            @input="onEmailInput"
          />
        </div>

        <div 
          class="hint" 
          :class="{ 
            error: hasError, 
            success: isAvailable && !hasError,
            warning: isChecking 
          }"
        >
          {{ hintMessage }}
        </div>

        <button 
          type="submit" 
          class="cta-btn" 
          :class="{ active: isAvailable && !hasError }"
          :disabled="!isAvailable || hasError"
        >
          Continue
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../../utils/axios.js';

const router = useRouter();

const email = ref('');
const isFocused = ref(false);
const hasError = ref(false);
const isAvailable = ref(false);
const isChecking = ref(false);

let checkTimeout = null;

const isValidFormat = computed(() => {
  return /^[\w.-]+@[A-Za-z\d.-]+\.[A-Za-z]{2,}$/.test(email.value);
});

const hintMessage = computed(() => {
  if (!email.value) {
    return 'CHOOSE YOUR FAVOURITE ONE';
  }
  if (isChecking.value) {
    return 'CHECKING AVAILABILITY...';
  }
  if (hasError.value) {
    return 'EMAIL ALREADY IN USE OR INVALID FORMAT';
  }
  if (isAvailable.value) {
    return "GREAT, LET'S SEE WHAT'S NEXT!";
  }
  if (!isValidFormat.value && email.value.length > 0) {
    return 'REMEMBER, IT HAS TO BE AN ACTUAL EMAIL.';
  }
  return 'CHOOSE YOUR FAVOURITE ONE';
});

const onEmailInput = () => {
  hasError.value = false;
  isAvailable.value = false;

  if (checkTimeout) {
    clearTimeout(checkTimeout);
  }

  if (!isValidFormat.value) {
    return;
  }

  isChecking.value = true;
  
  checkTimeout = setTimeout(async () => {
    try {
      const response = await axios.get('/api/account/check-email', {
        params: { email: email.value }
      });
      
      isAvailable.value = response.data.available;
      hasError.value = !response.data.available;
    } catch (error) {
      if (error.response?.status === 409) {
        isAvailable.value = false;
        hasError.value = true;
      } else if (error.response?.status === 400) {
        hasError.value = true;
      }
    } finally {
      isChecking.value = false;
    }
  }, 500);
};

const handleContinue = () => {
  if (isAvailable.value && !hasError.value) {
    sessionStorage.setItem('registerEmail', email.value);
    router.push('/account/register/password');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

.register-email {
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
  justify-content: center;
  padding: 40px 24px;
  overflow-y: auto;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Kode Mono", monospace;
  font-size: 1.8rem;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 30px;
  line-height: 1.2;
}

.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  gap: 20px;
}

.input-group {
  position: relative;
  border: 2px solid #E0E0E0;
  border-radius: 6px;
  transition: border-color 0.2s, background-color 0.2s;
  background-color: #fff;
}

.input-group.focused {
  border-color: #1A1A1A;
}

.input-group.valid {
  border-color: #27AE60;
}

.input-group.error {
  border-color: #EB5757;
  background-color: rgba(235, 87, 87, 0.06);
}

.input-group.checking {
  border-color: #F2C94C;
}

.input-group input {
  width: 100%;
  padding: 16px;
  font-family: "Kode Mono", monospace;
  font-size: 1rem;
  border: none;
  outline: none;
  background: transparent;
  border-radius: 6px;
}

.hint {
  font-family: "Kode Mono", monospace;
  font-size: 0.9rem;
  min-height: 18px;
  text-align: center;
  color: #4F4F4F;
}

.hint.error {
  color: #EB5757;
}

.hint.success {
  color: #27AE60;
}

.hint.warning {
  color: #F2C94C;
}

.cta-btn {
  width: 100%;
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
  margin-top: 10px;
}

.cta-btn:hover:not(:disabled) {
  background: #e5b017;
}

.cta-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow:
    inset -3px 3px 0 #FFDA5D,
    inset 3px -3px 0 rgba(0,0,0,0.25);
}

.cta-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #E0E0E0;
  color: #BDBDBD;
  box-shadow: none;
}

@media (max-width: 1024px) {
  .title {
    font-size: 2.4rem;
  }

  .back-btn {
    font-size: 2rem;
  }

  .header-title {
    font-size: 1.7rem;
  }

  .input-group input {
    padding: 22px;
    font-size: 1.4rem;
  }

  .hint {
    font-size: 1.2rem;
  }

  .cta-btn {
    font-size: 1.6rem;
    height: 70px;
  }

  .form {
    max-width: 90%;
  }
}
</style>