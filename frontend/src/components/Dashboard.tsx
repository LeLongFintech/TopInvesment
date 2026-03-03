import React from 'react';

export default function Dashboard() {
  return (
    <main className="flex-1 h-screen overflow-y-auto bg-background-dark relative">
      {/* Background Gradient Glow */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
      <div className="p-8 max-w-[1600px] mx-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Tổng quan thị trường</h2>
            <p className="text-slate-400 mt-1">Cập nhật lúc 14:05:32 - 24/05/2024</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-surface-highlight rounded-lg text-slate-300 hover:text-white hover:border-primary/50 transition-colors text-sm font-medium">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              <span>Hôm nay</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 text-sm font-medium">
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>Xuất báo cáo</span>
            </button>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: VN-INDEX */}
          <div className="bg-surface-dark border border-surface-highlight rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-slate-400 text-sm font-medium">VN-Index</p>
                <h3 className="text-2xl font-bold text-white mt-1">1,245.50</h3>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
                +1.2%
              </span>
            </div>
            <div className="h-10 w-full mt-2">
              <svg className="w-full h-full text-emerald-500" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path d="M0,35 Q20,30 40,20 T100,5" fill="none" stroke="currentColor" strokeWidth="2"></path>
                <path d="M0,35 Q20,30 40,20 T100,5 V40 H0 Z" fill="currentColor" opacity="0.1"></path>
              </svg>
            </div>
          </div>

          {/* Card 2: HNX-INDEX */}
          <div className="bg-surface-dark border border-surface-highlight rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-slate-400 text-sm font-medium">HNX-Index</p>
                <h3 className="text-2xl font-bold text-white mt-1">230.15</h3>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
                +0.5%
              </span>
            </div>
            <div className="h-10 w-full mt-2">
              <svg className="w-full h-full text-emerald-500" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path d="M0,30 Q30,35 60,15 T100,10" fill="none" stroke="currentColor" strokeWidth="2"></path>
                <path d="M0,30 Q30,35 60,15 T100,10 V40 H0 Z" fill="currentColor" opacity="0.1"></path>
              </svg>
            </div>
          </div>

          {/* Card 3: UPCOM */}
          <div className="bg-surface-dark border border-surface-highlight rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-slate-400 text-sm font-medium">UPCOM</p>
                <h3 className="text-2xl font-bold text-white mt-1">85.40</h3>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-bold">
                <span className="material-symbols-outlined text-[14px] mr-1">trending_down</span>
                -0.2%
              </span>
            </div>
            <div className="h-10 w-full mt-2">
              <svg className="w-full h-full text-red-500" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path d="M0,10 Q30,5 50,25 T100,35" fill="none" stroke="currentColor" strokeWidth="2"></path>
                <path d="M0,10 Q30,5 50,25 T100,35 V40 H0 Z" fill="currentColor" opacity="0.1"></path>
              </svg>
            </div>
          </div>

          {/* Card 4: Market Cap */}
          <div className="bg-surface-dark border border-surface-highlight rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-slate-400 text-sm font-medium">Thanh khoản</p>
                <h3 className="text-2xl font-bold text-white mt-1">15,402 Tỷ</h3>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
                <span className="material-symbols-outlined text-[14px] mr-1">show_chart</span>
                High
              </span>
            </div>
            <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-right">Target: 20K Tỷ</p>
          </div>
        </div>

        {/* Main Chart & Sidebar Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-dark border border-surface-highlight rounded-2xl p-6 shadow-lg shadow-black/20">
              <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    VN-Index Chart
                    <span className="text-xs font-normal text-slate-400 px-2 py-0.5 rounded border border-slate-700">Realtime</span>
                  </h3>
                </div>
                <div className="flex bg-surface-highlight rounded-lg p-1 gap-1">
                  <button className="px-3 py-1 text-xs font-medium rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors">1D</button>
                  <button className="px-3 py-1 text-xs font-medium rounded bg-primary text-white shadow-sm">1W</button>
                  <button className="px-3 py-1 text-xs font-medium rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors">1M</button>
                  <button className="px-3 py-1 text-xs font-medium rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors">3M</button>
                  <button className="px-3 py-1 text-xs font-medium rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors">1Y</button>
                </div>
              </div>
              {/* Chart Container */}
              <div className="w-full h-[350px] relative overflow-hidden rounded-lg bg-[#13080c] border border-surface-highlight/50">
                {/* SVG Chart Simulation */}
                <svg className="w-full h-full" height="100%" preserveAspectRatio="none" viewBox="0 0 800 350" width="100%">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#f4257b" stopOpacity="0.3"></stop>
                      <stop offset="100%" stopColor="#f4257b" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line stroke="#2d121b" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="70" y2="70"></line>
                  <line stroke="#2d121b" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="140" y2="140"></line>
                  <line stroke="#2d121b" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="210" y2="210"></line>
                  <line stroke="#2d121b" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="280" y2="280"></line>
                  {/* Main Line */}
                  <path d="M0,280 C50,260 100,300 150,220 C200,140 250,180 300,150 C350,120 400,160 450,100 C500,40 550,80 600,60 C650,40 700,90 750,50 L800,30" fill="none" stroke="#f4257b" strokeWidth="3"></path>
                  {/* Fill under line */}
                  <path d="M0,280 C50,260 100,300 150,220 C200,140 250,180 300,150 C350,120 400,160 450,100 C500,40 550,80 600,60 C650,40 700,90 750,50 L800,30 V350 H0 Z" fill="url(#chartGradient)"></path>
                  {/* Candlestick Decorations (Simulated) */}
                  <rect fill="#f4257b" height="40" opacity="0.8" rx="2" width="8" x="100" y="250"></rect>
                  <rect fill="#333" height="30" opacity="0.8" rx="2" width="8" x="250" y="150"></rect>
                  <rect fill="#f4257b" height="50" opacity="0.8" rx="2" width="8" x="400" y="100"></rect>
                  <rect fill="#f4257b" height="20" opacity="0.8" rx="2" width="8" x="550" y="70"></rect>
                  <rect fill="#333" height="30" opacity="0.8" rx="2" width="8" x="700" y="60"></rect>
                </svg>
                {/* Tooltip Simulation */}
                <div className="absolute top-[50px] left-[600px] bg-surface-highlight border border-primary/30 p-2 rounded shadow-xl backdrop-blur-sm">
                  <p className="text-[10px] text-slate-400">11:30 AM</p>
                  <p className="text-sm font-bold text-white">1,248.12</p>
                </div>
                <div className="absolute top-[58px] left-[604px] size-2 rounded-full bg-primary ring-4 ring-primary/20"></div>
              </div>
            </div>

            {/* Market Sectors Heatmap (Simplified) */}
            <div className="bg-surface-dark border border-surface-highlight rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Dòng tiền ngành</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                <div className="flex-1 min-w-[120px] bg-surface-highlight/30 p-4 rounded-xl border border-surface-highlight hover:border-emerald-500/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-500">
                      <span className="material-symbols-outlined text-sm">apartment</span>
                    </div>
                    <span className="text-white text-sm font-semibold">BĐS</span>
                  </div>
                  <p className="text-emerald-400 font-bold">+2.4%</p>
                </div>
                <div className="flex-1 min-w-[120px] bg-surface-highlight/30 p-4 rounded-xl border border-surface-highlight hover:border-emerald-500/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-500">
                      <span className="material-symbols-outlined text-sm">account_balance</span>
                    </div>
                    <span className="text-white text-sm font-semibold">Ngân hàng</span>
                  </div>
                  <p className="text-emerald-400 font-bold">+1.1%</p>
                </div>
                <div className="flex-1 min-w-[120px] bg-surface-highlight/30 p-4 rounded-xl border border-surface-highlight hover:border-red-500/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-red-500/20 p-1.5 rounded-lg text-red-500">
                      <span className="material-symbols-outlined text-sm">factory</span>
                    </div>
                    <span className="text-white text-sm font-semibold">Thép</span>
                  </div>
                  <p className="text-red-400 font-bold">-0.8%</p>
                </div>
                <div className="flex-1 min-w-[120px] bg-surface-highlight/30 p-4 rounded-xl border border-surface-highlight hover:border-emerald-500/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-500">
                      <span className="material-symbols-outlined text-sm">shopping_cart</span>
                    </div>
                    <span className="text-white text-sm font-semibold">Bán lẻ</span>
                  </div>
                  <p className="text-emerald-400 font-bold">+0.5%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Top Stocks Table */}
          <div className="xl:col-span-1 flex flex-col h-full">
            <div className="bg-surface-dark border border-surface-highlight rounded-2xl p-0 overflow-hidden flex flex-col h-full shadow-lg shadow-black/20">
              <div className="p-5 border-b border-surface-highlight flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Top Cổ Phiếu</h3>
                <button className="text-primary text-sm font-semibold hover:text-primary/80 transition-colors">Xem tất cả</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#180e12] text-slate-400 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-5 py-3">Mã CP</th>
                      <th className="px-5 py-3 text-right">Giá</th>
                      <th className="px-5 py-3 text-right">+/-</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-highlight">
                    <tr className="hover:bg-surface-highlight/30 transition-colors group cursor-pointer">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded bg-white flex items-center justify-center font-bold text-black text-xs shadow-sm">HPG</div>
                          <div>
                            <p className="font-bold text-white text-sm">Hòa Phát</p>
                            <p className="text-xs text-slate-500">Thép</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="text-white font-medium text-sm">28.50</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded font-bold">+2.5%</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-highlight/30 transition-colors group cursor-pointer">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">SSI</div>
                          <div>
                            <p className="font-bold text-white text-sm">SSI Corp</p>
                            <p className="text-xs text-slate-500">Chứng khoán</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="text-white font-medium text-sm">32.15</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded font-bold">+1.8%</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-highlight/30 transition-colors group cursor-pointer">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded bg-orange-500 flex items-center justify-center font-bold text-white text-xs shadow-sm">FPT</div>
                          <div>
                            <p className="font-bold text-white text-sm">FPT Corp</p>
                            <p className="text-xs text-slate-500">Công nghệ</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="text-white font-medium text-sm">92.00</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded font-bold">+1.5%</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-highlight/30 transition-colors group cursor-pointer">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded bg-red-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">VIC</div>
                          <div>
                            <p className="font-bold text-white text-sm">Vingroup</p>
                            <p className="text-xs text-slate-500">Bất động sản</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="text-white font-medium text-sm">45.20</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-block px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded font-bold">-1.2%</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-highlight/30 transition-colors group cursor-pointer">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded bg-green-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">VCB</div>
                          <div>
                            <p className="font-bold text-white text-sm">Vietcombank</p>
                            <p className="text-xs text-slate-500">Ngân hàng</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="text-white font-medium text-sm">88.10</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded font-bold">+0.3%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
