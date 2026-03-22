import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import  AuthProvider  from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Toaster 
    position="top-right"
    toastOptions={{
          style: {
            background: 'white',
            color: 'black',
            borderRadius: '5px',
            padding: '10px 20px',
            border: '1px solid lightgrey',
            boxShadow:'none'
          }
        }}
    />
    <App />
  </AuthProvider>,
)
