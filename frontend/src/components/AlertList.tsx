import React from 'react';
import type { Alert } from '../types/Alert';

interface Props {
  alerts: Alert[];
  isMobile?: boolean;
}

const AlertList: React.FC<Props> = ({ alerts, isMobile = false }) => {
  if (!alerts.length) return <p>No alerts</p>;

  const severityColors: Record<string, string> = {
    High: '#FF4C4C',
    Medium: '#FFA500',
    Low: '#4CAF50',
  };

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 300 : 600 }}>
        <thead>
          <tr>
            <th style={{ padding: 5, borderBottom: '1px solid #444' }}>Type</th>
            <th style={{ padding: 5, borderBottom: '1px solid #444' }}>Severity</th>
            <th style={{ padding: 5, borderBottom: '1px solid #444' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map(a => (
            <tr key={a.id}>
              <td style={{ padding: 5 }}>{a.type}</td>
              <td style={{
                padding: 5,
                color: '#fff',
                backgroundColor: severityColors[a.severity] || '#888',
                textAlign: 'center',
                borderRadius: 4,
              }}>{a.severity}</td>
              <td style={{ padding: 5 }}>{a.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertList;
