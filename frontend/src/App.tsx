import React, { useEffect, useState } from 'react';
import AlertList from './components/AlertList';
import type { Alert } from './types/Alert';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

// Hook to detect window size
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
}

const App: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState<'High' | 'Medium' | 'Low'>('High');
  const [description, setDescription] = useState('');

  const { width } = useWindowSize();
  const isMobile = width < 600;
  //const isTablet = width >= 600 && width < 900;

  const severityColors: Record<string, string> = {
    High: '#FF4C4C',
    Medium: '#FFA500',
    Low: '#4CAF50',
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      const data: Alert[] = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // live updates
    return () => clearInterval(interval);
  }, []);

  const addAlert = async () => {
    try {
      const newAlert = { type, severity, description };
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlert),
      });
      setType('');
      setSeverity('High');
      setDescription('');
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert();
  };

  // Counts for cards and charts
  const highCount = alerts.filter(a => a.severity === 'High').length;
  const mediumCount = alerts.filter(a => a.severity === 'Medium').length;
  const lowCount = alerts.filter(a => a.severity === 'Low').length;

  const severityCounts = [
    { name: 'High', value: highCount },
    { name: 'Medium', value: mediumCount },
    { name: 'Low', value: lowCount },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      padding: '10px',
      boxSizing: 'border-box',
      background: '#121212',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ textAlign: 'center', margin: '5px 0' }}>Minning SOC Dashboard</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: isMobile ? 'center' : 'flex-start',
        marginBottom: 10
      }}>
        <input style={{ flex: isMobile ? '1 1 100%' : '1 1 100px' }} placeholder="Type" value={type} onChange={e => setType(e.target.value)} required />
        <select style={{ flex: isMobile ? '1 1 100%' : '1 1 100px' }} value={severity} onChange={e => setSeverity(e.target.value as any)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input style={{ flex: isMobile ? '1 1 100%' : '2 1 150px' }} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <button style={{ flex: isMobile ? '1 1 100%' : '1 1 80px' }} type="submit">Add Alert</button>
      </form>

      {/* Top Cards */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        flex: 1,
        gap: 10,
        marginBottom: 10
      }}>
        {[{ label: 'High Alerts', value: highCount, color: severityColors.High },
          { label: 'Medium Alerts', value: mediumCount, color: severityColors.Medium },
          { label: 'Low Alerts', value: lowCount, color: severityColors.Low }].map(card => (
          <div key={card.label} style={{
            flex: 1,
            background: '#1f1f1f',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: isMobile ? 60 : 100
          }}>
            <h3>{card.label}</h3>
            <p style={{ fontSize: isMobile ? 18 : 24, color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        flex: 2,
        gap: 10,
        minHeight: 0
      }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <h3 style={{ textAlign: 'center', margin: 0 }}>Pie Chart</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
            <PieChart>
              <Pie data={severityCounts} dataKey="value" nameKey="name" outerRadius={80} label>
                {severityCounts.map(entry => (
                  <Cell key={entry.name} fill={severityColors[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <h3 style={{ textAlign: 'center', margin: 0 }}>Bar Chart</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
            <BarChart data={severityCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="value">
                {severityCounts.map(entry => (
                  <Cell key={entry.name} fill={severityColors[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 3, marginTop: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <AlertList alerts={alerts} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
};

export default App;
