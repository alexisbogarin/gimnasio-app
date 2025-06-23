// src/components/admin/RegisterMemberForm.jsx

import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function RegisterMemberForm({ onClose, onSuccess }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [celular, setCelular] = useState('');
  const [duracion, setDuracion] = useState('1'); // Duración en meses
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Calcular la fecha de vencimiento
    const fechaVencimiento = new Date();
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + parseInt(duracion));

    try {
      const { error } = await supabase.from('miembros').insert([
        { 
          nombre, 
          apellido, 
          dni, 
          celular, 
          fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0] // Formato YYYY-MM-DD
        },
      ]);

      if (error) throw error;
      
      alert('¡Miembro registrado con éxito!');
      onSuccess(); // Llama a la función para refrescar la lista
      onClose(); // Cierra el modal

    } catch (error) {
      console.error('Error al registrar miembro:', error);
      setError('Error al registrar el miembro. Verifique que el DNI no esté duplicado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fondo oscuro del modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Contenedor del formulario */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar Nuevo Miembro</h2>
        <form onSubmit={handleSubmit}>
          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="p-2 border rounded" required />
            <input type="text" placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} className="p-2 border rounded" required />
            <input type="text" placeholder="DNI" value={dni} onChange={e => setDni(e.target.value)} className="p-2 border rounded" required />
            <input type="text" placeholder="Celular" value={celular} onChange={e => setCelular(e.target.value)} className="p-2 border rounded" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Duración de la Membresía</label>
            <select value={duracion} onChange={e => setDuracion(e.target.value)} className="w-full p-2 border rounded">
              <option value="1">1 Mes</option>
              <option value="2">2 Meses</option>
              <option value="3">3 Meses</option>
              <option value="6">6 Meses</option>
              <option value="12">12 Meses</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterMemberForm;