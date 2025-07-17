import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import Spinner from './Spinner';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/tickets/stats')
      .then(res => setStats(res.data))
      .catch(() => { });
  }, []);

  if (!stats) return <Spinner />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={stats}>
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" />
      </BarChart>
    </ResponsiveContainer>
  );
}