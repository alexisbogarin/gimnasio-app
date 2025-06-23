// src/pages/CheckinPage.jsx

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // <-- Importamos nuestro cliente

function CheckinPage() {
  const [dni, setDni] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckin = async (e) => {
    e.preventDefault();
    if (!dni) {
      setMessage('Por favor, ingresa tu DNI.');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      // 1. Buscar al miembro por DNI en la base de datos
      const { data: miembro, error } = await supabase
        .from('miembros')
        .select('id, nombre, apellido, fecha_vencimiento')
        .eq('dni', dni)
        .single(); // .single() espera un solo resultado o ninguno

      if (error && error.code !== 'PGRST116') {
        // PGRST116 es el código para "no rows found", lo manejamos como DNI no encontrado.
        // Cualquier otro error sí es un problema.
        throw error;
      }
      
      if (!miembro) {
        setMessage('DNI no encontrado. Por favor, acércate a recepción.');
        setLoading(false);
        return;
      }

      // 2. Verificar si la membresía está activa
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Ignoramos la hora para comparar solo fechas
      const fechaVencimiento = new Date(miembro.fecha_vencimiento + 'T00:00:00'); // Asegura la zona horaria correcta

      if (fechaVencimiento < hoy) {
        setMessage(`¡Hola, ${miembro.nombre}! Tu membresía está vencida.`);
        setLoading(false);
        return;
      }

      // 3. Si todo está OK, registrar el ingreso
      const { error: insertError } = await supabase
        .from('ingresos')
        .insert({ miembro_id: miembro.id });

      if (insertError) {
        throw insertError;
      }

      setMessage(`¡Bienvenido, ${miembro.nombre} ${miembro.apellido}!`);

    } catch (error) {
      console.error('Error en el proceso de check-in:', error);
      setMessage('Ocurrió un error. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
      setDni('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-2">GIMNASIO XYZ</h1>
        <p className="text-center text-gray-400 mb-6">Ingresa tu DNI para registrar tu asistencia</p>
        
        <form onSubmit={handleCheckin}>
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Tu DNI sin puntos"
            className="w-full p-4 bg-gray-700 rounded-lg text-white text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-lg text-xl transition-colors disabled:bg-gray-500"
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Verificar Ingreso'}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 text-center text-lg bg-gray-700 rounded-lg">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckinPage;