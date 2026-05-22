import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import 'leaflet/dist/leaflet.css'
import { theiaTheme } from './theme'
import './App.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={theiaTheme} defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </StrictMode>,
)
