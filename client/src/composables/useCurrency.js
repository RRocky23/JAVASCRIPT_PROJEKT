import { ref } from 'vue';
import axiosInstance from '../utils/axios.js';

const currency = ref(0);
const loading = ref(false);

export const useCurrency = () => {
  const fetchCurrency = async () => {
    loading.value = true;
    try {
      const response = await axiosInstance.get('/api/exchange/currency');
      currency.value = response.data.currency;
      return currency.value;
    } catch (error) {
      console.error('Error fetching currency:', error);
      return 0;
    } finally {
      loading.value = false;
    }
  };

  const updateCurrency = (newValue) => {
    currency.value = newValue;
  };

  const addCurrency = (amount) => {
    currency.value += amount;
  };

  const resetCurrency = () => {
    currency.value = 0;
  };

  return {
    currency,
    loading,
    fetchCurrency,
    updateCurrency,
    addCurrency,
    resetCurrency
  };
};
