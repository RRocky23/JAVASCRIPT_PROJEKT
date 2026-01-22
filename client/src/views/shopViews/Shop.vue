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

      // Initialize purchase quantities
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
.shop-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.shop-container {
  max-height: calc(100vh - 140px);
  overflow: auto;
  min-height: 0;
  padding-bottom: 140px;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

.shop-title {
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

  /* Top header with centered currency */
  .shop-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 12px;
  }

  .top-currency {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 1.25rem;
    font-weight: 700;
    color: #2c3e50;
  }

  .top-currency .currency-icon {
    font-size: 1.4rem;
  }

.shop-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.shop-item-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.shop-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: #2c3e50;
}

.item-type-badge {
  background: #3498db;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.item-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.price-display {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 700;
}

.currency-icon {
  font-size: 1.3rem;
}

.inventory-status {
  font-size: 0.95rem;
  color: #666;
  font-weight: 600;
}

.purchase-controls {
  display: flex;
  gap: 15px;
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-input {
  width: 60px;
  text-align: center;
  padding: 6px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
}

.purchase-btn {
  flex: 1;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 1rem;
}

.purchase-message {
  margin-top: 10px;
  padding: 8px;
  text-align: center;
  font-weight: 600;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .shop-container {
    padding: 10px;
  }

  .shop-title {
    font-size: 1.5rem;
  }

  .shop-item-card {
    padding: 15px;
  }

  .item-name {
    font-size: 1.2rem;
  }

  .purchase-controls {
    flex-direction: column;
    gap: 10px;
  }

  .quantity-selector {
    width: 100%;
    justify-content: center;
  }

  .purchase-btn {
    width: 100%;
  }
}
</style>
