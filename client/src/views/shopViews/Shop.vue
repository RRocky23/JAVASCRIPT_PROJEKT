<template>
  <div class="shop-container">
    <div class="shop-header">
      <h2 class="shop-title">Poké Mart</h2>
      <div class="top-currency">
        <span class="currency-icon">💰</span>
        <span class="currency-amount">{{ currency }}</span>
      </div>
    </div>

    <div v-if="loading" class="text-center">
      <p>Loading shop items...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else class="shop-items">
      <div v-for="item in shopItems" :key="item.itemId" class="shop-item-card">
        <div class="item-header">
          <h3 class="item-name">{{ item.itemName }}</h3>
          <span class="item-type-badge">{{ formatItemType(item.itemType) }}</span>
        </div>

        <p class="item-description">{{ item.description }}</p>

        <div class="item-info">
          <div class="price-display">
            <span class="currency-icon">💰</span>
            <span class="price">{{ item.price }}</span>
          </div>
          <div class="inventory-status">
            Owned: {{ getItemQuantity(item.itemId) }} / {{ item.maxQuantity }}
          </div>
        </div>

        <div class="purchase-controls">
          <div class="quantity-selector">
            <button
              class="btn btn-sm btn-secondary"
              @click="decreaseQuantity(item.itemId)"
              :disabled="purchaseQuantities[item.itemId] <= 1"
            >
              -
            </button>
            <input
              type="number"
              class="quantity-input"
              v-model.number="purchaseQuantities[item.itemId]"
              min="1"
              :max="item.maxQuantity - getItemQuantity(item.itemId)"
            />
            <button
              class="btn btn-sm btn-secondary"
              @click="increaseQuantity(item.itemId, item.maxQuantity)"
              :disabled="purchaseQuantities[item.itemId] >= (item.maxQuantity - getItemQuantity(item.itemId))"
            >
              +
            </button>
          </div>

          <button
            class="btn btn-primary purchase-btn"
            @click="handlePurchase(item)"
            :disabled="!canPurchase(item)"
          >
            Buy ({{ item.price * purchaseQuantities[item.itemId] }})
          </button>
        </div>

        <div v-if="purchaseMessages[item.itemId]" class="purchase-message">
          <span :class="purchaseMessages[item.itemId].success ? 'text-success' : 'text-danger'">
            {{ purchaseMessages[item.itemId].text }}
          </span>
        </div>
      </div>
    </div>
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axiosInstance from '../../utils/axios.js';
import { useCurrency } from '../../composables/useCurrency.js';
import BottomNav from '../../components/buttons/BottomNav.vue';

const { currency, fetchCurrency, updateCurrency } = useCurrency();

const shopItems = ref([]);
const inventory = ref({});
const purchaseQuantities = ref({});
const purchaseMessages = ref({});
const loading = ref(true);
const error = ref(null);

const formatItemType = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
};

const getItemQuantity = (itemId) => {
  return inventory.value[itemId] || 0;
};

const canPurchase = (item) => {
  const quantity = purchaseQuantities.value[item.itemId] || 1;
  const totalCost = item.price * quantity;
  const currentQuantity = getItemQuantity(item.itemId);

  return (
    currency.value >= totalCost &&
    currentQuantity + quantity <= item.maxQuantity
  );
};

const increaseQuantity = (itemId, maxQuantity) => {
  const currentInventory = getItemQuantity(itemId);
  if (purchaseQuantities.value[itemId] < maxQuantity - currentInventory) {
    purchaseQuantities.value[itemId]++;
  }
};

const decreaseQuantity = (itemId) => {
  if (purchaseQuantities.value[itemId] > 1) {
    purchaseQuantities.value[itemId]--;
  }
};

const handlePurchase = async (item) => {
  const quantity = purchaseQuantities.value[item.itemId] || 1;

  // Confirmation for bulk purchases (>5)
  if (quantity > 5) {
    const confirmed = confirm(`Are you sure you want to buy ${quantity}x ${item.itemName} for ${item.price * quantity} coins?`);
    if (!confirmed) return;
  }

  try {
    const response = await axiosInstance.post('/api/shop/purchase', {
      itemId: item.itemId,
      quantity
    });

    if (response.data.success) {
      // Update currency
      updateCurrency(response.data.purchase.remainingCurrency);

      // Update inventory
      inventory.value[item.itemId] = response.data.inventory.quantity;

      // Show success message
      purchaseMessages.value[item.itemId] = {
        success: true,
        text: `+${quantity} ${item.itemName}!`
      };

      // Reset quantity
      purchaseQuantities.value[item.itemId] = 1;

      // Clear message after 3 seconds
      setTimeout(() => {
        purchaseMessages.value[item.itemId] = null;
      }, 3000);
    }
  } catch (err) {
    console.error('Purchase error:', err);
    const errorMessage = err.response?.data?.message || 'Purchase failed';

    purchaseMessages.value[item.itemId] = {
      success: false,
      text: errorMessage
    };

    setTimeout(() => {
      purchaseMessages.value[item.itemId] = null;
    }, 5000);
  }
};

const loadShopItems = async () => {
  try {
    loading.value = true;
    const response = await axiosInstance.get('/api/shop/items');

    if (response.data.success) {
      shopItems.value = response.data.items;

      shopItems.value.forEach(item => {
        purchaseQuantities.value[item.itemId] = 1;
      });
    }
  } catch (err) {
    console.error('Error loading shop items:', err);
    error.value = 'Failed to load shop items';
  } finally {
    loading.value = false;
  }
};

const loadInventory = async () => {
  try {
    const response = await axiosInstance.get('/api/inventory');

    if (response.data.success) {
      // Convert array to object for easier lookup
      inventory.value = response.data.inventory.reduce((acc, item) => {
        acc[item.itemId] = item.quantity;
        return acc;
      }, {});
    }
  } catch (err) {
    console.error('Error loading inventory:', err);
  }
};

onMounted(async () => {
  await Promise.all([
    loadShopItems(),
    loadInventory(),
    fetchCurrency()
  ]);
});
</script>

<style scoped>
@import '../client/src/styles/ShopStyles.css';
</style>
