import React from 'react';
export default function Navbar() {
  return (
    <nav style={{ padding: 12, background: '#f3f4f6' }}>
      <span style={{ marginRight: 12 }}>ERP</span>
      <a href="/dashboard" style={{ marginRight: 8 }}>Dashboard</a>
      <a href="/login">Login</a>
    </nav>
  );
}
