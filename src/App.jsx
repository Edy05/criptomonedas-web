import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import Formulario from './components/Formulario'
import Resultado from './components/Resultado'
import Spinner from './components/Spinner'
import ImagenCripto from './img/imagen-criptos.png'

const Contenedor = styled.div`
  max-width: 900px;
  margin: 0 auto;
  width: 90%;
  @media (min-width: 992px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 2rem;
  }
`
const Imagen = styled.img`
  max-width: 400px;
  width: 80%;
  margin: 100px auto 0 auto;
  display: block;
`

const Heading = styled.h1`
  font-family: 'Lato', sans-serif;
  color: #FFF;
  text-align: center;
  font-weight: 700;
  margin-top: 80px;
  margin-bottom: 50px;
  font-size: 34px;

  &::after {
    content: '';
    width: 100px;
    height: 6px;
    background-color: #66A2FE;
    display: block;
    margin: 10px auto 0 auto;
  }
` 

function App() {

  const [ monedas, setMonedas ] = useState({})
  const [ resultado, setResultado ] = useState({})
  const [ cargando, setCargando ] = useState(false)

useEffect(() => {
    if(Object.keys(monedas).length > 0) {
        
      const cotizarCripto = async () => {
          setCargando(true)
          setResultado({})

          const { moneda, criptomoneda } = monedas
          const url = `/.netlify/functions/cotizar-criptos?criptomoneda=${criptomoneda}&moneda=${moneda}`

          console.log('URL:', url)
          console.log('Criptomoneda:', criptomoneda)
          console.log('Moneda:', moneda)

          try {
              const respuesta = await fetch(url)
              const resultado = await respuesta.json()

              console.log('Respuesta completa:', resultado)

              // Manejar la respuesta de Netlify Function
              let datos = null
              
              if (resultado.DISPLAY) {
                  datos = resultado.DISPLAY
                  console.log('Datos directamente en DISPLAY')
              } else if (resultado.body) {
                  const parsed = JSON.parse(resultado.body)
                  console.log('Body parseado:', parsed)
                  datos = parsed.DISPLAY
              }
              
              console.log('Datos:', datos)
              
              if(datos && datos[criptomoneda] && datos[criptomoneda][moneda]) {
                  console.log('Resultado encontrado:', datos[criptomoneda][moneda])
                  setResultado(datos[criptomoneda][moneda])
              } else {
                  console.error('No se encontraron datos para:', criptomoneda, moneda)
                  console.error('Datos disponibles:', datos ? Object.keys(datos) : 'null')
              }

          } catch (error) {
              console.error('Error en la cotización:', error)
          }

          setCargando(false)
      }

      cotizarCripto()
    }
}, [monedas])

  return (
      <Contenedor>
          <Imagen 
            src={ImagenCripto}
            alt="imagenes criptomonedas"
          />

          <div>
              <Heading>Cotiza Criptomonedas al Instante</Heading>
              <Formulario 
                setMonedas={setMonedas}
              />

              {cargando && <Spinner />}
              {resultado.PRICE && <Resultado resultado={resultado} />} 
          </div>

      </Contenedor>
  )
}

export default App
