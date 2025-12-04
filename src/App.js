import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'

import Home from './components/home/home.js'
// ...existing code...
import BodegaDatosLayout from './components/layouts/layaoutBodegaDatos.js' 

import 'admin-lte/dist/css/adminlte.min.css'
import 'admin-lte/dist/js/adminlte.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'

// Función para decodificar JWT
function decodeJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join('')
  );
  return JSON.parse(jsonPayload);
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false) 

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  )
}

function AppContent({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Control de inactividad - tiempo en milisegundos (configurable)
  //const INACTIVITY_TIME = 30 * 1000;
  const INACTIVITY_TIME = 5 * 60 * 1000; // 5 minutos (300000 ms)
  // Para cambiar el tiempo de inactividad, modifica estos valores:
  // 1 minuto = 1 * 60 * 1000 = 60000 ms
  // 5 minutos = 5 * 60 * 1000 = 300000 ms
  // 10 minutos = 10 * 60 * 1000 = 600000 ms
  
  const WARNING_TIME = 30 * 1000; // 30 segundos antes de cerrar sesión
  
  // Referencias para los timers
  const inactivityTimer = React.useRef(null);
  const warningTimer = React.useRef(null);
  const lastActivityTime = React.useRef(Date.now());
  const [showWarning, setShowWarning] = useState(false);

  // Función para cerrar sesión por inactividad
  const logoutDueToInactivity = React.useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('username');
    localStorage.removeItem('id_rolusuario');
    localStorage.removeItem('id_usuariosistema');
    setIsAuthenticated(false);
    setShowWarning(false);
    toast.error('Sesión cerrada por inactividad', {
      containerId: "session-alerts"
    });
    // navigate('/login'); // Eliminado: ya no existe la ruta de login
  }, [setIsAuthenticated, navigate]);

  // Función para resetear el timer de inactividad
  const resetInactivityTimer = React.useCallback(() => {
    lastActivityTime.current = Date.now();
    setShowWarning(false);
    
    console.log('🔄 Reseteando timers - Tiempo restante para advertencia:', (INACTIVITY_TIME - WARNING_TIME) / 1000, 'segundos');
    
    // Limpiar timers anteriores
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    if (warningTimer.current) {
      clearTimeout(warningTimer.current);
    }
    
    // Cerrar notificaciones de advertencia activas
    toast.dismiss();
    
    // Solo configurar nuevos timers si está autenticado
    if (isAuthenticated) {
      console.log('✅ Configurando timer de advertencia para', (INACTIVITY_TIME - WARNING_TIME) / 1000, 'segundos');
      
      // Timer para mostrar advertencia (INACTIVITY_TIME - WARNING_TIME segundos antes del cierre)
      warningTimer.current = setTimeout(() => {
        console.log('⚠️ EJECUTANDO ADVERTENCIA DE SESIÓN');
        setShowWarning(true);
        toast.warning(
          <>
            <div>Su sesión expirará en {WARNING_TIME / 1000} segundos por inactividad.</div>
            <button 
              onClick={() => {
                if (isAuthenticated) {
                  // Actualizar el tiempo de expiración del token por otros 30 segundos más
                  const newExpiry = Date.now() + INACTIVITY_TIME;
                  localStorage.setItem('tokenExpiry', newExpiry.toString());
                  
                  // Resetear el timer de inactividad
                  resetInactivityTimer();
                  
                  toast.success(`Sesión extendida por ${INACTIVITY_TIME / 1000} segundos más`, {
                    containerId: "session-alerts"
                  });
                }
              }}
              style={{
                marginTop: '10px',
                padding: '5px 10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Extender sesión
            </button>
          </>,
          {
            containerId: "session-alerts",
            position: "top-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            toastId: "session-warning" // ID único para evitar duplicados
          }
        );
        console.log('🚨 Toast de advertencia enviado');
      }, INACTIVITY_TIME - WARNING_TIME);

      // Timer para cerrar sesión después del tiempo de inactividad configurado
      inactivityTimer.current = setTimeout(() => {
        logoutDueToInactivity();
      }, INACTIVITY_TIME);
    }
  }, [isAuthenticated, logoutDueToInactivity, INACTIVITY_TIME, WARNING_TIME]);

  // Eventos que consideramos como actividad del usuario
  const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
  
  // Función separada para manejar mousemove con throttling
  const handleMouseMove = React.useCallback(() => {
    const now = Date.now();
    // Solo resetear si ha pasado más de 5 segundos desde la última actividad
    if (now - lastActivityTime.current > 5000) {
      console.log('🖱️ Movimiento de mouse después de 5 segundos de inactividad');
      resetInactivityTimer();
    }
  }, [resetInactivityTimer]);

  // Configurar listeners de actividad cuando el usuario está autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      console.log('🎯 Configurando listeners de actividad');
      
      // Configurar listeners para detectar actividad (excepto mousemove)
      activityEvents.forEach(event => {
        document.addEventListener(event, resetInactivityTimer, true);
      });
      
      // Manejar mousemove por separado con throttling
      document.addEventListener('mousemove', handleMouseMove, true);

      // Iniciar el timer de inactividad
      resetInactivityTimer();

      // Cleanup function
      return () => {
        console.log('🧹 Limpiando listeners de actividad');
        activityEvents.forEach(event => {
          document.removeEventListener(event, resetInactivityTimer, true);
        });
        document.removeEventListener('mousemove', handleMouseMove, true);
        if (inactivityTimer.current) {
          clearTimeout(inactivityTimer.current);
        }
        if (warningTimer.current) {
          clearTimeout(warningTimer.current);
        }
        toast.dismiss(); // Limpiar notificaciones activas
      };
    } else {
      // Si no está autenticado, limpiar los timers
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      if (warningTimer.current) {
        clearTimeout(warningTimer.current);
      }
      toast.dismiss();
    }
  }, [isAuthenticated, resetInactivityTimer, handleMouseMove]);

  // Verificar si hay una sesión válida al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (token && tokenExpiry) {
      try {
        // Verificar si el token no ha expirado
        if (Date.now() < parseInt(tokenExpiry)) {
          // Verificar que el token sea válido decodificándolo
          const decodedToken = decodeJwt(token);
          if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
          } else {
            // Token expirado, limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('username');
            localStorage.removeItem('id_rolusuario');
            localStorage.removeItem('id_usuariosistema');
          }
        } else {
          // Token expirado, limpiar localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          localStorage.removeItem('username');
          localStorage.removeItem('id_rolusuario');
          localStorage.removeItem('id_usuariosistema');
        }
      } catch (error) {
        // Token inválido, limpiar localStorage
        console.error('Token inválido:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('username');
        localStorage.removeItem('id_rolusuario');
        localStorage.removeItem('id_usuariosistema');
      }
    }
  }, []); // Solo se ejecuta una vez al montar el componente



  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/BodegaDatos'
          element={<BodegaDatosLayout setIsAuthenticated={setIsAuthenticated}/>}
        />

      </Routes>
      {/* ToastContainer para alertas generales */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* ToastContainer específico para alertas de sesión */}
      <ToastContainer
        containerId="session-alerts"
        position="top-center"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        style={{
          top: '20px',
          zIndex: 9999
        }}
      />
    </>
  );
}

export default App
