/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CanslimFilter from './components/CanslimFilter';
import ValueFilter from './components/ValueFilter';
import DividendFilter from './components/DividendFilter';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isDark, toggleTheme } = useTheme();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'canslim':
        return <CanslimFilter />;
      case 'value':
        return <ValueFilter />;
      case 'dividend':
        return <DividendFilter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-page font-display text-body antialiased relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}

      {/* Theme Toggle — Fixed top-right */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-surface border border-line shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 group"
        title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
      >
        <span className="material-symbols-outlined text-muted group-hover:text-primary transition-colors text-xl">
          {isDark ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </div>
  );
}
