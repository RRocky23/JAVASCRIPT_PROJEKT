<template>
  <div class="inventory-container">
    <div class="inventory-header">
      <h2 class="inventory-title">My Inventory</h2>
      <div class="top-currency">
        <span class="currency-icon">💰</span>
        <span class="currency-amount">{{ currency }}</span>
      </div>
    </div>

    <div v-if="loading" class="text-center">
      <p>Loading inventory...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="filteredInventory.length === 0" class="empty-inventory">
      <p class="empty-message">Your inventory is empty</p>
      <router-link to="/shop" class="btn btn-primary">Visit Shop</router-link>
    </div>

    <div v-else>
      <!-- Filter/Sort Controls -->
      <div class="controls">
        <div class="filter-group">
          <label for="typeFilter">Filter by type:</label>
          <select id="typeFilter" v-model="selectedType" class="form-select">
            <option value="all">All Items</option>
            <option value="pokeball">Pokéballs</option>
            <option value="potion">Potions</option>
            <option value="revive">Revives</option>
            <option value="evolution_stone">Evolution Stones</option>
          </select>
        </div>

        <div class="sort-group">
          <label for="sortBy">Sort by:</label>
          <select id="sortBy" v-model="sortBy" class="form-select">
            <option value="name">Name</option>
            <option value="quantity">Quantity</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>

      <!-- Inventory Items -->
      <div class="inventory-items">
        <div
          v-for="item in filteredInventory"
          :key="item.itemId"
          class="inventory-item-card"
        >
          <div class="item-header">
            <h3 class="item-name">{{ item.itemDetails.itemName }}</h3>
            <span class="item-type-badge">{{ formatItemType(item.itemDetails.itemType) }}</span>
          </div>

          <p class="item-description">{{ item.itemDetails.description }}</p>

          <div class="item-stats">
            <div class="stat-item">
              <span class="stat-label">Quantity:</span>
              <span class="stat-value quantity">{{ item.quantity }} / {{ item.itemDetails.maxQuantity }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Value:</span>
              <span class="stat-value">
                <span class="currency-icon">💰</span>
                {{ item.itemDetails.price }}
              </span>
            </div>
          </div>

          <div class="item-actions">
            <button
              class="btn btn-sm btn-outline-primary"
              @click="handleUseItem(item)"
              disabled
              title="Item usage will be implemented in future updates"
            >
              Use Item
            </button>
          </div>
        </div>
      </div>

      <div class="inventory-summary">
        <p><strong>Total Items:</strong> {{ totalItems }}</p>
        <p><strong>Total Value:</strong> <span class="currency-icon">💰</span>{{ totalValue }}</p>
      </div>
    </div>
  </div>
  <BottomNav />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axiosInstance from '../../utils/axios.js';
import { useCurrency } from '../../composables/useCurrency.js';
import BottomNav from '../../components/buttons/BottomNav.vue';

const { currency, fetchCurrency } = useCurrency();

const inventory = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedType = ref('all');
const sortBy = ref('name');

const formatItemType = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
};

const filteredInventory = computed(() => {
  let items = inventory.value;

  if (selectedType.value !== 'all') {
    items = items.filter(item => item.itemDetails.itemType === selectedType.value);
  }

  items = [...items].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.itemDetails.itemName.localeCompare(b.itemDetails.itemName);
      case 'quantity':
        return b.quantity - a.quantity;
      case 'type':
        return a.itemDetails.itemType.localeCompare(b.itemDetails.itemType);
      default:
        return 0;
    }
  });

  return items;
});

const totalItems = computed(() => {
  return filteredInventory.value.reduce((sum, item) => sum + item.quantity, 0);
});

const totalValue = computed(() => {
  return filteredInventory.value.reduce(
    (sum, item) => sum + (item.quantity * item.itemDetails.price),
    0
  );
});

const handleUseItem = (item) => {
  alert(`Using ${item.itemDetails.itemName} will be implemented in a future update!`);
};

const loadInventory = async () => {
  try {
    loading.value = true;
    const response = await axiosInstance.get('/api/inventory');

    if (response.data.success) {
      inventory.value = response.data.inventory;
    }
  } catch (err) {
    console.error('Error loading inventory:', err);
    error.value = 'Failed to load inventory';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadInventory(), fetchCurrency()]);
});
</script>

<style scoped>
@import '../client/src/styles/InventoryStyles.css';
</style>