<template>
  <div class="profile-page">
    <div class="header">
      <div class="header-spacer"></div>
      <div class="header-title">Account</div>
      <div class="header-spacer"></div>
    </div>

    <div class="content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

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
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

.profile-page {
  width: 100vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

/* HEADER */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #fff;
  flex-shrink: 0;
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

/* CONTENT */
.content {
  flex: 1;
  padding: 30px 24px 100px;
  overflow-y: auto;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #FEC41B;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* PROFILE CONTAINER */
.profile-container {
  max-width: 600px;
  margin: 0 auto;
}

/* PROFILE HEADER */
.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #FEC41B;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-family: "JetBrains Mono", monospace;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1A1A1A;
  margin: 0;
}

/* INFO SECTION */
.info-section {
  margin-bottom: 40px;
}

.section-title {
  font-family: "JetBrains Mono", monospace;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1A1A1A;
  margin: 0 0 20px 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: #E0E0E0;
  border-radius: 6px;
  overflow: hidden;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.info-item:hover {
  background-color: #f8f9fa;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.info-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85rem;
  color: #666;
  font-weight: 400;
}

.info-value {
  font-family: "JetBrains Mono", monospace;
  font-size: 1rem;
  color: #1A1A1A;
  font-weight: 400;
}

.arrow {
  font-size: 1.5rem;
  color: #666;
  margin-left: 10px;
}

/* ACTIONS SECTION */
.actions-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  width: 100%;
  padding: 14px 20px;
  font-family: "JetBrains Mono", monospace;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn {
  background-color: #FEC41B;
  color: #fff;
  box-shadow:
    inset -6px 6px 0 #FFDA5D,
    inset 6px -6px 0 rgba(0,0,0,0.25);
}

.logout-btn:hover {
  background-color: #e5b017;
}

.delete-btn {
  background-color: transparent;
  color: #EB5757;
  border: 2px solid #EB5757;
}

.delete-btn:hover {
  background-color: rgba(235, 87, 87, 0.1);
}

.delete-warning {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  color: #EB5757;
  text-align: center;
  margin: 4px 0 0 0;
}

@media (max-width: 1024px) {
  .username {
    font-size: 1.8rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .info-label {
    font-size: 1rem;
  }

  .info-value {
    font-size: 1.2rem;
  }

  .action-btn {
    font-size: 1.2rem;
    padding: 18px 24px;
  }

  .delete-warning {
    font-size: 0.9rem;
  }
}
</style>