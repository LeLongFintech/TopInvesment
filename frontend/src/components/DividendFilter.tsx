import React from 'react';

export default function DividendFilter() {
  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-page">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
      <div className="px-8 py-8 max-w-[1400px] mx-auto w-full z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary/20 text-primary p-1 rounded-md"><span className="material-symbols-outlined text-[20px]">filter_alt</span></span>
              <span className="text-muted text-sm font-medium tracking-wide uppercase">Investment Tools</span>
            </div>
            <h2 className="text-heading text-3xl md:text-4xl font-bold tracking-tight">Dividend Stocks Filter</h2>
            <p className="text-muted text-base max-w-2xl">Discover high-yield stocks with consistent payout histories and strong fundamentals for your passive income portfolio.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-el hover:bg-el/80 text-heading rounded-xl text-sm font-medium transition-colors border border-line"><span className="material-symbols-outlined text-[18px]">download</span>Export Data</button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all"><span className="material-symbols-outlined text-[18px]">add</span>Create Alert</button>
          </div>
        </div>
        <div className="flex flex-col gap-4 mb-6">
          <div className="w-full">
            <label className="relative flex items-center w-full max-w-lg h-12 rounded-xl bg-surface border border-line focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden group">
              <div className="absolute left-4 text-muted group-focus-within:text-primary transition-colors"><span className="material-symbols-outlined">search</span></div>
              <input className="w-full bg-transparent border-none text-heading placeholder-muted/70 pl-12 pr-4 focus:ring-0 h-full text-base" placeholder="Search by ticker symbol or company name..." type="text" />
            </label>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm text-muted font-medium mr-1">Quick Filters:</span>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30 text-sm font-medium hover:bg-primary/30 transition-colors"><span className="material-symbols-outlined text-[18px]">trending_up</span>Yield &gt; 5%<span className="material-symbols-outlined text-[16px]">close</span></button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-el hover:bg-el/80 text-muted hover:text-heading border border-transparent hover:border-line text-sm font-medium transition-colors"><span className="material-symbols-outlined text-[18px]">calendar_month</span>Monthly Payout<span className="material-symbols-outlined text-[16px]">expand_more</span></button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-el hover:bg-el/80 text-muted hover:text-heading border border-transparent hover:border-line text-sm font-medium transition-colors"><span className="material-symbols-outlined text-[18px]">calendar_view_week</span>Quarterly Payout<span className="material-symbols-outlined text-[16px]">expand_more</span></button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-el hover:bg-el/80 text-muted hover:text-heading border border-transparent hover:border-line text-sm font-medium transition-colors"><span className="material-symbols-outlined text-[18px] text-yellow-500 filled">stars</span>Dividend Aristocrats<span className="material-symbols-outlined text-[16px]">expand_more</span></button>
          </div>
        </div>
        <div className="w-full bg-surface rounded-2xl border border-line shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-el/50 border-b border-line">
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider w-32">Ticker</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider text-right">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider w-64">Dividend Yield</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider text-right">Payout Ratio</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-muted uppercase tracking-wider">Frequency</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-muted uppercase tracking-wider w-20">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr className="group hover:bg-el/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="bg-primary/20 p-2 rounded-lg text-primary mr-3 font-bold group-hover:bg-primary group-hover:text-white transition-colors">VNM</div><span className="text-heading font-bold">VNM</span></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-heading">Vinamilk</div><div className="text-xs text-muted">Consumer Goods</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><div className="text-sm font-bold text-heading">67,500 ₫</div><div className="text-xs text-emerald-400 flex justify-end items-center gap-1"><span className="material-symbols-outlined text-[12px]">arrow_upward</span> 1.2%</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex flex-col gap-1.5"><div className="flex justify-between items-end"><span className="text-sm font-bold text-heading">5.8%</span><span className="text-xs text-muted">Target: 7%</span></div><div className="w-full h-2 bg-el rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: '82%' }}></div></div></div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">70%</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className="text-sm text-muted">Quarterly</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className="material-symbols-outlined text-emerald-400">trending_up</span></td>
                </tr>
                <tr className="group hover:bg-el/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="bg-el p-2 rounded-lg text-muted mr-3 font-bold group-hover:bg-primary group-hover:text-white transition-colors">HPG</div><span className="text-heading font-bold">HPG</span></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-heading">Hoa Phat Group</div><div className="text-xs text-muted">Basic Materials</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><div className="text-sm font-bold text-heading">28,100 ₫</div><div className="text-xs text-rose-400 flex justify-end items-center gap-1"><span className="material-symbols-outlined text-[12px]">arrow_downward</span> 0.5%</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex flex-col gap-1.5"><div className="flex justify-between items-end"><span className="text-sm font-bold text-heading">3.2%</span><span className="text-xs text-muted">Target: 7%</span></div><div className="w-full h-2 bg-el rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: '45%' }}></div></div></div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">45%</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className="text-sm text-muted">Annual</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className="material-symbols-outlined text-rose-400">trending_down</span></td>
                </tr>
                <tr className="group hover:bg-el/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="bg-el p-2 rounded-lg text-muted mr-3 font-bold group-hover:bg-primary group-hover:text-white transition-colors">MBB</div><span className="text-heading font-bold">MBB</span></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-heading">MB Bank</div><div className="text-xs text-muted">Financial Services</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><div className="text-sm font-bold text-heading">18,500 ₫</div><div className="text-xs text-emerald-400 flex justify-end items-center gap-1"><span className="material-symbols-outlined text-[12px]">arrow_upward</span> 0.8%</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex flex-col gap-1.5"><div className="flex justify-between items-end"><span className="text-sm font-bold text-heading">4.5%</span><span className="text-xs text-muted">Target: 7%</span></div><div className="w-full h-2 bg-el rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: '64%' }}></div></div></div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">30%</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className="text-sm text-muted">Annual</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className="material-symbols-outlined text-emerald-400">trending_up</span></td>
                </tr>
                <tr className="group hover:bg-el/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="bg-el p-2 rounded-lg text-muted mr-3 font-bold group-hover:bg-primary group-hover:text-white transition-colors">FPT</div><span className="text-heading font-bold">FPT</span></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-heading">FPT Corp</div><div className="text-xs text-muted">Technology</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><div className="text-sm font-bold text-heading">95,000 ₫</div><div className="text-xs text-emerald-400 flex justify-end items-center gap-1"><span className="material-symbols-outlined text-[12px]">arrow_upward</span> 2.1%</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex flex-col gap-1.5"><div className="flex justify-between items-end"><span className="text-sm font-bold text-heading">2.1%</span><span className="text-xs text-muted">Target: 7%</span></div><div className="w-full h-2 bg-el rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: '30%' }}></div></div></div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">35%</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className="text-sm text-muted">Semi-Annual</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className="material-symbols-outlined text-emerald-400">trending_up</span></td>
                </tr>
                <tr className="group hover:bg-el/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="bg-el p-2 rounded-lg text-muted mr-3 font-bold group-hover:bg-primary group-hover:text-white transition-colors">REE</div><span className="text-heading font-bold">REE</span></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-heading">Ree Corp</div><div className="text-xs text-muted">Utilities</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><div className="text-sm font-bold text-heading">60,200 ₫</div><div className="text-xs text-muted flex justify-end items-center gap-1"><span className="material-symbols-outlined text-[12px]">remove</span> 0.0%</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex flex-col gap-1.5"><div className="flex justify-between items-end"><span className="text-sm font-bold text-heading">3.4%</span><span className="text-xs text-muted">Target: 7%</span></div><div className="w-full h-2 bg-el rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: '48%' }}></div></div></div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">40%</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className="text-sm text-muted">Quarterly</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className="material-symbols-outlined text-emerald-400">trending_up</span></td>
                </tr>
                <tr className="group hover:bg-el/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="bg-primary/20 p-2 rounded-lg text-primary mr-3 font-bold group-hover:bg-primary group-hover:text-white transition-colors">GAS</div><span className="text-heading font-bold">GAS</span></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-heading">PV Gas</div><div className="text-xs text-muted">Energy</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><div className="text-sm font-bold text-heading">78,900 ₫</div><div className="text-xs text-emerald-400 flex justify-end items-center gap-1"><span className="material-symbols-outlined text-[12px]">arrow_upward</span> 0.3%</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex flex-col gap-1.5"><div className="flex justify-between items-end"><span className="text-sm font-bold text-heading">4.8%</span><span className="text-xs text-muted">Target: 7%</span></div><div className="w-full h-2 bg-el rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: '68%' }}></div></div></div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">60%</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className="text-sm text-muted">Semi-Annual</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center"><span className="material-symbols-outlined text-emerald-400">trending_up</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-line bg-surface">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <p className="text-sm text-muted">Showing <span className="font-bold text-heading">1</span> to <span className="font-bold text-heading">6</span> of <span className="font-bold text-heading">97</span> results</p>
              <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <a className="relative inline-flex items-center rounded-l-md px-2 py-2 text-muted ring-1 ring-inset ring-line hover:bg-el focus:z-20" href="#"><span className="material-symbols-outlined text-[18px]">chevron_left</span></a>
                <a aria-current="page" className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20" href="#">1</a>
                <a className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-muted ring-1 ring-inset ring-line hover:bg-el hover:text-heading focus:z-20" href="#">2</a>
                <a className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-muted ring-1 ring-inset ring-line hover:bg-el hover:text-heading focus:z-20" href="#">3</a>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-muted ring-1 ring-inset ring-line">...</span>
                <a className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-muted ring-1 ring-inset ring-line hover:bg-el hover:text-heading focus:z-20" href="#">10</a>
                <a className="relative inline-flex items-center rounded-r-md px-2 py-2 text-muted ring-1 ring-inset ring-line hover:bg-el focus:z-20" href="#"><span className="material-symbols-outlined text-[18px]">chevron_right</span></a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
