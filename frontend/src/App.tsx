/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import CanslimFilter from './pages/CanslimFilter';
import ValueFilter from './pages/ValueFilter';
import DividendFilter from './pages/DividendFilter';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-page font-display text-body antialiased relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* All tabs stay mounted — hidden via CSS to preserve state */}
      <div className={activeTab === 'dashboard' ? 'flex flex-1 overflow-hidden' : 'hidden'}><Dashboard /></div>
      <div className={activeTab === 'canslim' ? 'flex flex-1 overflow-hidden' : 'hidden'}><CanslimFilter /></div>
      <div className={activeTab === 'value' ? 'flex flex-1 overflow-hidden' : 'hidden'}><ValueFilter /></div>
      <div className={activeTab === 'dividend' ? 'flex flex-1 overflow-hidden' : 'hidden'}><DividendFilter /></div>

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
