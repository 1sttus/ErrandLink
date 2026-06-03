import React from 'react';
import { StateProvider, useStore } from './context/StateContext';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import Signup from './components/Signup';
import CustomerDashboard from './components/CustomerDashboard';
import RunnerDashboard from './components/RunnerDashboard';
import VendorDashboard from './components/VendorDashboard';
import GuestDashboard from './components/GuestDashboard';
import SupportFeedback from './components/SupportFeedback';

function MainApp() {
  const { currentView } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'onboarding':
        return <Onboarding />;
      case 'login':
        return <Login />;
      case 'signup':
        return <Signup />;
      case 'customer':
        return <CustomerDashboard />;
      case 'runner':
        return <RunnerDashboard />;
      case 'vendor':
        return <VendorDashboard />;
      case 'guest':
        return <GuestDashboard />;
      default:
        return <GuestDashboard />;
    }
  };

  return (
    <div className="relative min-h-screen text-gray-200 overflow-x-hidden bg-[#050508] font-sans">
      {/* Mesh Gradient Background with flowing glassmorphic orbs */}
      <div className="mesh-gradient fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      
      {/* Responsive layout content layer */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {renderView()}
        <SupportFeedback />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StateProvider>
      <MainApp />
    </StateProvider>
  );
}
