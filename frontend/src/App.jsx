import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SecurityRecords from './pages/SecurityRecords';

import CreateRecord from './pages/CreateRecord';
import EditRecord from './pages/EditRecord';
import AuditLogs from './pages/AuditLogs';

// Placeholder for missing pages
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-full text-center">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-[var(--color-text-muted)]">This page is under construction.</p>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/records" element={<SecurityRecords />} />
        <Route path="/records/create" element={<CreateRecord />} />
        <Route path="/records/edit/:id" element={<EditRecord />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/analytics" element={<Placeholder title="Analytics" />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
