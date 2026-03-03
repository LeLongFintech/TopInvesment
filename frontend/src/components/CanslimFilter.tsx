import React from 'react';

export default function CanslimFilter() {
  return (
    <main className="flex-1 p-8 overflow-y-auto h-screen bg-background-light dark:bg-[#221017]">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tight text-text-main">
              Bộ lọc <span className="text-primary">CANSLIM</span>
            </h1>
            <p className="text-text-muted text-base max-w-2xl">
              Advanced stock screening based on William O'Neil's growth strategy. Identify high-potential stocks before they make their major moves.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card-bg border border-border-color text-text-muted hover:text-white hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-xl">save</span>
              <span className="text-sm font-medium">Save Preset</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all">
              <span className="material-symbols-outlined text-xl">play_arrow</span>
              <span className="text-sm font-bold">Run Filter</span>
            </button>
          </div>
        </header>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Criteria Card: Earnings */}
          <div className="bg-card-bg rounded-xl p-6 border border-border-color/30 flex flex-col gap-5 shadow-lg">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">monetization_on</span>
              </div>
              <h3 className="text-lg font-bold text-white">Earnings Growth</h3>
            </div>
            {/* Toggle 1 */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Current Earnings (C)</span>
                <span className="text-xs text-text-muted">EPS growth &gt; 20% vs last year</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input defaultChecked className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="w-full h-px bg-white/5"></div>
            {/* Toggle 2 */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Annual Earnings (A)</span>
                <span className="text-xs text-text-muted">3-Year EPS Growth &gt; 25%</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input defaultChecked className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {/* Criteria Card: Technicals */}
          <div className="bg-card-bg rounded-xl p-6 border border-border-color/30 flex flex-col gap-5 shadow-lg">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">candlestick_chart</span>
              </div>
              <h3 className="text-lg font-bold text-white">Technical Strength</h3>
            </div>
            {/* Toggle 3 */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">New Highs (N)</span>
                <span className="text-xs text-text-muted">Breaking out of base</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            {/* Slider: RS Rating */}
            <div className="flex flex-col gap-3 mt-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white">RS Rating (S)</span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Min: 80</span>
              </div>
              <div className="relative w-full h-2 bg-gray-700 rounded-lg">
                <div className="absolute h-full bg-primary rounded-lg" style={{ width: '20%', left: '80%' }}></div>
                <input className="absolute w-full h-full opacity-0 cursor-pointer z-10" max="99" min="1" type="range" defaultValue="80" />
                {/* Visual Thumbs */}
                <div className="absolute w-4 h-4 bg-white rounded-full shadow border-2 border-primary top-1/2 transform -translate-y-1/2 left-[80%] pointer-events-none"></div>
              </div>
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>1</span>
                <span>50</span>
                <span>99</span>
              </div>
            </div>
          </div>

          {/* Criteria Card: Institutional */}
          <div className="bg-card-bg rounded-xl p-6 border border-border-color/30 flex flex-col gap-5 shadow-lg">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">corporate_fare</span>
              </div>
              <h3 className="text-lg font-bold text-white">Institutional Support</h3>
            </div>
            {/* Toggle 4 */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Leader vs Laggard (L)</span>
                <span className="text-xs text-text-muted">Industry Group Rank Top 20%</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input defaultChecked className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            {/* Toggle 5 */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Institutional Sponsorship (I)</span>
                <span className="text-xs text-text-muted">Increasing fund ownership</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input defaultChecked className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Filtered Results 
              <span className="text-sm font-normal text-text-muted bg-white/5 px-2 py-1 rounded-full border border-white/10">12 Matches</span>
            </h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted transition-colors">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>
          <div className="bg-card-bg rounded-xl border border-border-color/30 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-border-color/50 text-text-muted text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Symbol</th>
                    <th className="p-4 font-semibold">Company Name</th>
                    <th className="p-4 font-semibold text-right">Price</th>
                    <th className="p-4 font-semibold text-right">Change %</th>
                    <th className="p-4 font-semibold text-center">RS Rating</th>
                    <th className="p-4 font-semibold text-right">Volume</th>
                    <th className="p-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-border-color/20">
                  {/* Row 1 */}
                  <tr className="group hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">NV</span>
                        NVDA
                      </div>
                    </td>
                    <td className="p-4 text-white">NVIDIA Corp</td>
                    <td className="p-4 text-right text-white font-mono">$485.09</td>
                    <td className="p-4 text-right font-medium text-green-400">+2.45%</td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">99</span>
                    </td>
                    <td className="p-4 text-right text-text-muted">45.2M</td>
                    <td className="p-4 text-center">
                      <button className="text-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                      </button>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="group hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">MS</span>
                        MSFT
                      </div>
                    </td>
                    <td className="p-4 text-white">Microsoft Corporation</td>
                    <td className="p-4 text-right text-white font-mono">$376.12</td>
                    <td className="p-4 text-right font-medium text-green-400">+1.12%</td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">94</span>
                    </td>
                    <td className="p-4 text-right text-text-muted">22.1M</td>
                    <td className="p-4 text-center">
                      <button className="text-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                      </button>
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="group hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">AM</span>
                        AMZN
                      </div>
                    </td>
                    <td className="p-4 text-white">Amazon.com Inc</td>
                    <td className="p-4 text-right text-white font-mono">$145.20</td>
                    <td className="p-4 text-right font-medium text-red-400">-0.45%</td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/30">88</span>
                    </td>
                    <td className="p-4 text-right text-text-muted">38.5M</td>
                    <td className="p-4 text-center">
                      <button className="text-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                      </button>
                    </td>
                  </tr>
                  {/* Row 4 */}
                  <tr className="group hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs">TS</span>
                        TSLA
                      </div>
                    </td>
                    <td className="p-4 text-white">Tesla Inc</td>
                    <td className="p-4 text-right text-white font-mono">$240.55</td>
                    <td className="p-4 text-right font-medium text-green-400">+3.20%</td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">92</span>
                    </td>
                    <td className="p-4 text-right text-text-muted">89.4M</td>
                    <td className="p-4 text-center">
                      <button className="text-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="p-4 border-t border-border-color/50 flex items-center justify-between bg-white/5">
              <span className="text-xs text-text-muted">Showing 1-4 of 12 results</span>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-color/50 text-text-muted hover:text-white hover:bg-white/10 disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-color/50 text-text-muted hover:text-white hover:bg-white/10 text-xs">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-color/50 text-text-muted hover:text-white hover:bg-white/10 text-xs">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-color/50 text-text-muted hover:text-white hover:bg-white/10">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
