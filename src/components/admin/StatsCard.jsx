// src/components/admin/StatsCard.jsx

import React from 'react';

function StatsCard({ title, value, loading }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {loading ? (
        <div className="mt-1 h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
      ) : (
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      )}
    </div>
  );
}

export default StatsCard;