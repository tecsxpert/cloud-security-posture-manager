import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-[var(--color-primary)] overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col w-full min-w-0">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
