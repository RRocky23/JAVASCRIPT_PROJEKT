<template>
  <div class="inventory-container">
    <h2 class="inventory-title">My Inventory</h2>

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

      <!-- Summary -->
      <div class="inventory-summary">
        <p><strong>Total Items:</strong> {{ totalItems }}</p>
        <p><strong>Total Value:</strong> <span class="currency-icon">💰</span>{{ totalValue }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axiosInstance from '../../utils/axios.js';

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

  // Filter by type
  if (selectedType.value !== 'all') {
    items = items.filter(item => item.itemDetails.itemType === selectedType.value);
  }

  // Sort
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
  // Placeholder for future implementation
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

onMounted(() => {
  loadInventory();
});
</script>

<style scoped>
.inventory-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.inventory-title {
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.empty-inventory {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-message {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  padding: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-group,
.sort-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label,
.sort-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.inventory-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.inventory-item-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.inventory-item-card:hover {
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
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  color: #2c3e50;
}

.item-type-badge {
  background: #3498db;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.item-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
  font-size: 0.95rem;
}

.item-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.stat-value {
  font-weight: 700;
  color: #2c3e50;
  font-size: 1rem;
}

.stat-value.quantity {
  color: #27ae60;
}

.currency-icon {
  font-size: 1.1rem;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.inventory-summary {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.inventory-summary p {
  margin: 10px 0;
  font-size: 1.1rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .inventory-container {
    padding: 10px;
  }

  .inventory-title {
    font-size: 1.5rem;
  }

  .controls {
    flex-direction: column;
    gap: 15px;
  }

  .inventory-items {
    grid-template-columns: 1fr;
  }

  .item-name {
    font-size: 1.1rem;
  }
}
</style>
