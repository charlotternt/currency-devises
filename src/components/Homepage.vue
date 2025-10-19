<template>
  <div class="converter-container">
    <h1>Convertisseur de Devise</h1>
    <div class="input-group">
      <input
        type="number"
        v-model="amount"
        placeholder="Montant"
        @input="convert"
      />
      <select v-model="fromCurrency" @change="convert">
        <option v-for="currency in currencies" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>
      <span>→</span>
      <select v-model="toCurrency" @change="convert">
        <option v-for="currency in currencies" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>
      <input
        type="text"
        v-model="result"
        placeholder="Résultat"
        readonly
      />
    </div>
    <div v-if="loading" class="loader">Conversion en cours...</div>
    <p v-if="error" class="error">{{ error }}</p>
    <p class="rate" v-if="rate && !loading">
      1 {{ fromCurrency }} = {{ rate.toFixed(6) }} {{ toCurrency }}
    </p>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { getSupportedCurrencies, convertCurrency } from '../services/currencyAPI'

const amount = ref(1)
const fromCurrency = ref('EUR')
const toCurrency = ref('USD')
const result = ref('')
const rate = ref(null)
const error = ref('')
const currencies = ref([])
const loading = ref(false)

onMounted(async () => {
  try {
    currencies.value = await getSupportedCurrencies()
  } catch (err) {
    error.value = err.message
  }
})

const convert = async () => {
  if (!amount.value) {
    result.value = ''
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { result: conversionResult, rate: conversionRate } = await convertCurrency(
      amount.value,
      fromCurrency.value,
      toCurrency.value
    )
    result.value = conversionResult.toFixed(2)
    rate.value = conversionRate
  } catch (err) {
    error.value = err.message
    result.value = ''
  } finally {
    loading.value = false
  }
}
</script>
