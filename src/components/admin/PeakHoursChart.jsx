// src/components/admin/PeakHoursChart.jsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PeakHoursChart({ data, loading }) {
  if (loading) {
    return <div className="bg-white p-6 rounded-lg shadow-md h-96 animate-pulse"></div>
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-96">
      <h3 className="font-semibold text-gray-800 mb-4">Horas de Mayor Afluencia (Últimos 30 días)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5, }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hora" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="ingresos" fill="#1d4ed8" name="Ingresos por Hora" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PeakHoursChart;