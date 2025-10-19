import axios from 'axios'

const API_KEY = '7ffa263f391ade3366717550'
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`


export async function getSupportedCurrencies() {
  try {
    const response = await axios.get(`${BASE_URL}/codes`)
    return response.data.supported_codes.map(([code]) => code)
  } catch (error) {
    console.error("Erreur lors de la récupération des devises:", error)
    throw new Error("Impossible de charger les devises. Vérifie ta connexion.")
  }
}

export async function convertCurrency(amount, from, to) {
  if (amount <= 0) {
    throw new Error("Le montant doit être supérieur à 0.")
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/pair/${from}/${to}/${amount}`
    )
    return {
      result: response.data.conversion_result,
      rate: response.data.conversion_rate,
    }
  } catch (error) {
    console.error("Erreur lors de la conversion:", error)
    throw new Error("Erreur de conversion. Vérifie les devises ou ta connexion.")
  }
}
