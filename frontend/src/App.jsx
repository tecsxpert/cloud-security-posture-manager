import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SecurityRecords from './pages/SecurityRecords';

import CreateRecord from './pages/CreateRecord';
import EditRecord from './pages/EditRecord';
import AuditLogs from './pages/AuditLogs';
import Analytics from './pages/Analytics';

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
        <Route path="/analytics" element={<Analytics />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
