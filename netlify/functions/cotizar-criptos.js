exports.handler = async (event) => {
  try {
    const { criptomoneda, moneda } = event.queryStringParameters || {}
    
    if (!criptomoneda || !moneda) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan parámetros' }),
      }
    }

    // CoinGecko API - usa IDs de CoinGecko
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${criptomoneda}&vs_currencies=${moneda.toLowerCase()}&include_24hr_change=true&include_high_low_24h=true`
    
    const response = await fetch(url)
    const data = await response.json()

    // Transformar los datos al formato que espera Resultado.jsx
    if (data[criptomoneda]) {
      const criptoData = data[criptomoneda]
      
      // Formato compatible con el componente Resultado
      const resultadoFormateado = {
        DISPLAY: {
          [criptomoneda]: {
            [moneda]: {
              PRICE: `$${criptomoneda[moneda.toLowerCase()]?.toFixed(2) || 'N/A'}`,
              HIGHDAY: `$${criptomoneda[`${moneda.toLowerCase()}_24h_high`] || 'N/A'}`,
              LOWDAY: `$${criptomoneda[`${moneda.toLowerCase()}_24h_low`] || 'N/A'}`,
              CHANGEPCT24HOUR: `${criptomoneda[`${moneda.toLowerCase()}_24h_change`] || 0} %`,
              IMAGEURL: `/media/37746251/${criptomoneda}.png`,
              LASTUPDATE: new Date().toLocaleString()
            }
          }
        }
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify(resultadoFormateado),
      }
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Criptomoneda no encontrada' }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}