exports.handler = async (event) => {
  try {
    const { criptomoneda, moneda } = event.queryStringParameters || {}
    
    if (!criptomoneda || !moneda) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan parámetros' }),
      }
    }

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    const response = await fetch(url)
    const data = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}