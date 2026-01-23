<template>
  <div class="profile-page">
    <Header header-title="Profile" />

    <div class="content">
      <Spinner v-if="loading" />

      <div v-else-if="user" class="profile-container">
        <!-- Avatar + Username -->
        <div class="profile-header">
          <div class="avatar">
            <img :src="userAvatar" :alt="user.username" />
          </div>
          <h2 class="username">{{ user.username }}</h2>
        </div>

        <!-- Account Information -->
        <div class="info-section">
          <h3 class="section-title">Account information</h3>
          
          <div class="info-list">
            <div class="info-item" @click="editName">
              <div class="info-content">
                <span class="info-label">Name</span>
                <span class="info-value">{{ user.username }}</span>
              </div>
              <span class="arrow">›</span>
            </div>

            <div class="info-item" @click="editEmail">
              <div class="info-content">
                <span class="info-label">Email</span>
                <span class="info-value">{{ user.email }}</span>
              </div>
              <span class="arrow">›</span>
            </div>

            <div class="info-item" @click="editPassword">
              <div class="info-content">
                <span class="info-label">Password</span>
                <span class="info-value">••••••••••••</span>
              </div>
              <span class="arrow">›</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions-section">
          <button class="action-btn logout-btn" @click="handleLogout">
            Log Out
          </button>
          <button class="action-btn delete-btn" @click="handleDelete">
            Delete account
          </button>
          <p class="delete-warning">THIS OPERATION CAN'T BE UNDONE.</p>
        </div>
      </div>
    </div>

    <BottomNavigation />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth.js';
import BottomNavigation from './BottomNavigation.vue';

import Header from '../../components/common/Header.vue';
import Spinner from '../../components/common/Spinner.vue';

const router = useRouter();
const { user, logout, fetchUser, isLoggedIn } = useAuth();
const loading = ref(true);

const userAvatar = computed(() => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.value?.username || 'default'}`;
});

onMounted(async () => {
  if (!isLoggedIn.value) {
    router.push('/starter/onboarding4');
    return;
  }

  try {
    await fetchUser();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    router.push('/starter/onboarding4');
  } finally {
    loading.value = false;
  }
});

const editName = () => {
  alert('Edit name functionality - to be implemented');
};

const editEmail = () => {
  alert('Edit email functionality - to be implemented');
};

const editPassword = () => {
  alert('Edit password functionality - to be implemented');
};

const handleLogout = async () => {
  if (confirm('Are you sure you want to log out?')) {
    await logout();
  }
};

const handleDelete = () => {
  alert('Delete account functionality - to be implemented\nTHIS OPERATION CAN\'T BE UNDONE.');
};
</script>

<style scoped>
@import '../client/src/styles/ProfileStyles.css';
</style>