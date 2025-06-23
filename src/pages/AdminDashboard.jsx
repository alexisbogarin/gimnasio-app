import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import RegisterMemberForm from '../components/admin/RegisterMemberForm';
import StatsCard from '../components/admin/StatsCard';
import PeakHoursChart from '../components/admin/PeakHoursChart';

function AdminDashboard() {
  const [miembros, setMiembros] = useState([]);
  const [stats, setStats] = useState({});
  const [peakHoursData, setPeakHoursData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    
    // --- Fetch de Miembros (como antes) ---
    const { data: miembrosData, error: miembrosError } = await supabase
      .from('miembros').select('*').order('created_at', { ascending: false });

    if (miembrosError) console.error('Error al cargar miembros:', miembrosError);
    else setMiembros(miembrosData);

    // --- Fetch de Estadísticas ---
    const hoy = new Date();
    const hoyISO = hoy.toISOString().split('T')[0];
    
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    const inicioSemanaISO = inicioSemana.toISOString().split('T')[0];

    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const inicioMesISO = inicioMes.toISOString().split('T')[0];

    // .select con { count: 'exact', head: true } es una optimización para solo contar filas
    const { count: ingresosHoy } = await supabase.from('ingresos').select('*', { count: 'exact', head: true }).gte('created_at', hoyISO);
    const { count: ingresosSemana } = await supabase.from('ingresos').select('*', { count: 'exact', head: true }).gte('created_at', inicioSemanaISO);
    const { count: ingresosMes } = await supabase.from('ingresos').select('*', { count: 'exact', head: true }).gte('created_at', inicioMesISO);
    const { count: miembrosActivos } = await supabase.from('miembros').select('*', { count: 'exact', head: true }).gte('fecha_vencimiento', hoyISO);

    setStats({ hoy: ingresosHoy, semana: ingresosSemana, mes: ingresosMes, activos: miembrosActivos });

    // --- Fetch y Procesamiento para el Gráfico ---
    const treintaDiasAtras = new Date();
    treintaDiasAtras.setDate(hoy.getDate() - 30);
    const { data: ingresos30dias, error: ingresosError } = await supabase.from('ingresos').select('created_at').gte('created_at', treintaDiasAtras.toISOString());
    
    if (ingresosError) {
        console.error('Error fetching peak hours data:', ingresosError);
    } else {
        const hourlyCounts = Array(24).fill(0).map((_, i) => ({ hora: `${i}:00`, ingresos: 0 }));
        ingresos30dias.forEach(ingreso => {
            const hora = new Date(ingreso.created_at).getHours();
            hourlyCounts[hora].ingresos++;
        });
        setPeakHoursData(hourlyCounts);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleDelete = async (memberId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este miembro? Esta acción no se puede deshacer.')) {
      const { error } = await supabase.from('miembros').delete().eq('id', memberId);
      if (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar el miembro.');
      } else {
        alert('Miembro eliminado con éxito.');
        // Refresca la lista filtrando el miembro eliminado
        setMiembros(miembros.filter(m => m.id !== memberId));
      }
    }
  };

const handleRenew = async (memberId, fechaVencimientoActual) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimientoActual + 'T00:00:00');
    const baseParaRenovar = vencimiento < hoy ? hoy : vencimiento;
    const nuevaFechaVencimiento = new Date(baseParaRenovar);
    nuevaFechaVencimiento.setMonth(nuevaFechaVencimiento.getMonth() + 1);
    await supabase.from('miembros').update({ fecha_vencimiento: nuevaFechaVencimiento.toISOString().split('T')[0] }).eq('id', memberId);
    fetchDashboardData();
  };

  const getStatus = (fechaVencimiento) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(fechaVencimiento + 'T00:00:00');
    
    if (vencimiento < hoy) {
      return <span className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">Vencido</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">Activo</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Panel de Administración</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Registrar Miembro
          </button>
        </div>

        {/* --- Sección de Estadísticas --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard title="Ingresos del Día" value={stats.hoy} loading={loading} />
          <StatsCard title="Ingresos de la Semana" value={stats.semana} loading={loading} />
          <StatsCard title="Ingresos del Mes" value={stats.mes} loading={loading} />
          <StatsCard title="Miembros Activos" value={stats.activos} loading={loading} />
        </div>
        
        {/* --- Sección del Gráfico --- */}
        <div className="mb-6">
            <PeakHoursChart data={peakHoursData} loading={loading} />
        </div>
        
        {isModalOpen && <RegisterMemberForm onClose={() => setIsModalOpen(false)} onSuccess={fetchMiembros} />}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              {/* Thead se mantiene igual */}
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DNI</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vencimiento</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center p-5">Cargando...</td></tr>
                ) : (
                  miembros.map(miembro => (
                    <tr key={miembro.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">{miembro.nombre} {miembro.apellido}</td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">{miembro.dni}</td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">{new Date(miembro.fecha_vencimiento + 'T00:00:00').toLocaleDateString()}</td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">{getStatus(miembro.fecha_vencimiento)}</td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm flex gap-2">
                        <button onClick={() => handleRenew(miembro.id, miembro.fecha_vencimiento)} className="text-blue-600 hover:text-blue-900 font-semibold">Renovar</button>
                        <button onClick={() => handleDelete(miembro.id)} className="text-red-600 hover:text-red-900 font-semibold">Eliminar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;