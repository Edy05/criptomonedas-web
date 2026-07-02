exports.handler = async () => {
  try {
    const response = await fetch(
      'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD'
    );
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};