<template>
  <div class="register-password">
    <div class="header">
      <button class="back-btn" @click="goBack">‹</button>
      <div class="header-title">Create account</div>
      <div class="header-spacer"></div>
    </div>

    <div class="content">
      <div class="title">And now<br />a password:</div>

      <form class="form" @submit.prevent="handleContinue">
        <div 
          class="input-group" 
          :class="{ 
            focused: isFocused, 
            valid: isValid, 
            error: hasError 
          }"
        >
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            @focus="isFocused = true"
            @blur="isFocused = false"
            @input="validatePassword"
          />
          <button 
            type="button" 
            class="toggle-password" 
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </button>
        </div>

        <div 
          class="hint" 
          :class="{ 
            error: hasError, 
            success: isValid && !hasError 
          }"
        >
          {{ hintMessage }}
        </div>

        <ul v-if="password.length > 0" class="password-rules">
          <li :class="{ ok: passwordRules.minLength }">
            {{ passwordRules.minLength ? '✔️' : '✖️' }} minimum 8 characters
          </li>
          <li :class="{ ok: passwordRules.maxLength }">
            {{ passwordRules.maxLength ? '✔️' : '✖️' }} maximum 30 characters
          </li>
          <li :class="{ ok: passwordRules.uppercase }">
            {{ passwordRules.uppercase ? '✔️' : '✖️' }} at least 1 uppercase letter
          </li>
          <li :class="{ ok: passwordRules.number }">
            {{ passwordRules.number ? '✔️' : '✖️' }} at least 1 number
          </li>
          <li :class="{ ok: passwordRules.special }">
            {{ passwordRules.special ? '✔️' : '✖️' }} at least 1 special character
          </li>
        </ul>

        <button 
          type="submit" 
          class="cta-btn" 
          :class="{ active: isValid && !hasError }"
          :disabled="!isValid || hasError"
        >
          Continue
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const password = ref('');
const isFocused = ref(false);
const hasError = ref(false);
const showPassword = ref(false);

onMounted(() => {
  const savedEmail = sessionStorage.getItem('registerEmail');
  if (!savedEmail) {
    router.push('/account/register/email');
  }
});

const passwordRules = computed(() => ({
  minLength: password.value.length >= 8,
  maxLength: password.value.length <= 30,
  uppercase: /[A-Z]/.test(password.value),
  number: /\d/.test(password.value),
  special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password.value)
}));

const isValid = computed(() => {
  return Object.values(passwordRules.value).every(v => v === true);
});

const hintMessage = computed(() => {
  if (!password.value) {
    return 'MAKE IT STRONG LIKE TAUROS';
  }
  if (!isValid.value) {
    return 'DID YOU FORGET SOMETHING?';
  }
  return "I WON'T TELL ANYONE";
});

const validatePassword = () => {
  hasError.value = password.value.length > 0 && !isValid.value;
};

const handleContinue = () => {
  if (isValid.value && !hasError.value) {
    sessionStorage.setItem('registerPassword', password.value);
    router.push('/account/register/username');
  }
};

const goBack = () => {
  router.push('/account/register/email');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

.register-password {
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
  justify-content: center;
  padding: 40px 24px;
  overflow-y: auto;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "JetBrains Mono", monospace;
  font-size: 1.8rem;
  font-weight: 500;
  color: #1A1A1A;
  margin-bottom: 30px;
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

.input-group input {
  width: 100%;
  padding: 16px;
  padding-right: 50px;
  font-family: "Kode Mono", monospace;
  font-size: 1rem;
  border: none;
  outline: none;
  background: transparent;
  border-radius: 6px;
}

.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
}

.hint {
  font-family: "Kode Mono", monospace;
  font-size: 0.9rem;
  color: #4F4F4F;
  text-align: center;
  min-height: 18px;
}

.hint.error {
  color: #EB5757;
}

.hint.success {
  color: #27AE60;
}

.password-rules {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  font-family: "Kode Mono", monospace;
  font-size: 0.9rem;
  margin-top: -10px;
}

.password-rules li {
  color: #EB5757;
  margin-bottom: 6px;
  transition: 0.2s;
}

.password-rules li.ok {
  color: #27AE60;
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

  .toggle-password {
    font-size: 2rem;
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