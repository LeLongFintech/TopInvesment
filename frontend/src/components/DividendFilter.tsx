import React from 'react';

export default function DividendFilter() {
  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-background-dark">
      {/* Decorative gradient background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
      <div className="px-8 py-8 max-w-[1400px] mx-auto w-full z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary/20 text-primary p-1 rounded-md">
                <span className="material-symbols-outlined text-[20px]">filter_alt</span>
              </span>
              <span className="text-text-muted text-sm font-medium tracking-wide uppercase">Investment Tools</span>
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tight">Dividend Stocks Filter</h2>
            <p className="text-text-muted text-base max-w-2xl">Discover high-yield stocks with consistent payout histories and strong fundamentals for your passive income portfolio.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-highlight hover:bg-surface-highlight/80 text-white rounded-xl text-sm font-medium transition-colors border border-surface-highlight">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create Alert
            </button>
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="w-full">
            <label className="relative flex items-center w-full max-w-lg h-12 rounded-xl bg-surface-dark border border-surface-highlight focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden group">
              <div className="absolute left-4 text-text-muted group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input className="w-full bg-transparent border-none text-white placeholder-text-muted/70 pl-12 pr-4 focus:ring-0 h-full text-base" placeholder="Search by ticker symbol or company name..." type="text" />
            </label>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm text-text-muted font-medium mr-1">Quick Filters:</span>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30 text-sm font-medium hover:bg-primary/30 transition-colors">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
              Yield &gt; 5%
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-highlight hover:bg-surface-highlight/80 text-text-muted hover:text-white border border-transparent hover:border-surface-highlight text-sm font-medium transition-colors">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              Monthly Payout
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-highlight hover:bg-surface-highlight/80 text-text-muted hover:text-white border border-transparent hover:border-surface-highlight text-sm font-medium transition-colors">
              <span className="material-symbols-outlined text-[18px]">calendar_view_week</span>
              Quarterly Payout
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-highlight hover:bg-surface-highlight/80 text-text-muted hover:text-white border border-transparent hover:border-surface-highlight text-sm font-medium transition-colors">
              <span className="material-symbols-outlined text-[18px] text-yellow-500 filled">stars</span>
              Dividend Aristocrats
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="w-full bg-surface-dark rounded-2xl border border-surface-highlight shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-surface-highlight/50 border-b border-surface-highlight">
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider w-32">Ticker</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider text-right">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider w-64">Dividend Yield</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-wider text-right">Payout Ratio</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-text-muted uppercase tracking-wider">Frequency</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-text-muted uppercase tracking-wider w-20">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-highlight">
                {/* Row 1 */}
                <tr className="group hover:bg-surface-highlight/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-primary/20 p-2 rounded-lg text-primary mr-3 font-bold group-hover:bg-primary group-hover:text-white transition-colors">VNM</div>
                      <span className="text-white font-bold">VNM</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">Vinamilk</div>
                    <div className="text-xs text-text-muted">Consumer Goods</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-bold text-white">67,500 ₫</div>
                    <div className="text-xs text-emerald-400 flex justify-end items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">arrow_upward</span> 1.2%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-white">5.8%</span>
                        <span className="text-xs text-text-muted">Target: 7%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-highlight rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      70%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-text-muted">Quarterly</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-8 w-16 bg-contain bg-center bg-no-repeat opacity-80" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCw8W-X6d-g-WOFucku7dnygGucGIIiJySTuHYKm0LRAMzt0EXT3pYKGKk8k0PmhPeZlvdWY55WUkM3Aos3Q5owi9SkD7PSXlk9kW0eTpUOYm8QgqiIkb6uy1nFGP1amhux3IfzeW98EjlI5QvUQOYF1uNJXknDtqNaxlbIc4AY1uOCHJeHF5i4A0sjTRVqt8cHb67_X6fVwHjIaDqna1bHt4NlqidEP35uSfZIHX4CMk1cUbosJu5BbbX7gxpWeb5mgp7Utw2nUl4a")', filter: 'hue-rotate(90deg) brightness(1.5)'}}></div>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="group hover:bg-surface-highlight/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-surface-highlight p-2 rounded-lg text-text-muted mr-3 font-bold group-hover:bg-primary group-hover:text-white transition-colors">HPG</div>
                      <span className="text-white font-bold">HPG</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">Hoa Phat Group</div>
                    <div className="text-xs text-text-muted">Basic Materials</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-bold text-white">28,100 ₫</div>
                    <div className="text-xs text-rose-400 flex justify-end items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">arrow_downward</span> 0.5%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-white">3.2%</span>
                        <span className="text-xs text-text-muted">Target: 7%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-highlight rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      45%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-text-muted">Annual</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-8 w-16 bg-contain bg-center bg-no-repeat opacity-80" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDZovTKVfNLVtcVY-E2HB4gueSqiBfJd259kFOuD9h-WHZBB4thaXcM--NP0oG92NQwL0V0jgZa0p36jX02oMyYZEvXIgU460WeVnQ3RqeOzivRmTUJIEjnMKyJGXYNBO24YEe9jK35Xqyk4n2X4i5grgBMi5aW7H2RlmhdPR4jfazDDTdCotBifDQIajC-qkEA4AsNZHyYAfdMz9rU5v2uXnal1DPeERmbpIiSSxJz3MixnajlIkXrivHy4TLejAp5kbkFGIDT1lF3")', filter: 'hue-rotate(-20deg) brightness(1.2)'}}></div>
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className="group hover:bg-surface-highlight/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-surface-highlight p-2 rounded-lg text-text-muted mr-3 font-bold group-hover:bg-primary group-hover:text-white transition-colors">MBB</div>
                      <span className="text-white font-bold">MBB</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">MB Bank</div>
                    <div className="text-xs text-text-muted">Financial Services</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-bold text-white">18,500 ₫</div>
                    <div className="text-xs text-emerald-400 flex justify-end items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">arrow_upward</span> 0.8%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-white">4.5%</span>
                        <span className="text-xs text-text-muted">Target: 7%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-highlight rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      30%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-text-muted">Annual</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-8 w-16 bg-contain bg-center bg-no-repeat opacity-80" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCpZEBNBw5w_JKNuuTfPS5T5atrTAZlm7UC1iicxnFEysYRYOSxvzag2wAxKvdzDUEDFXBPG0__JwkZwOIDSMBAn2OjHZjXATOCe0dEB33KWK0py-dBUNNA6m8zuk38aYmFV38l6R5oUev_ytdjRtm_hCJoRgB1hyar3Ed5BMENDX45lTWGPhqkAKs9p_WYfu2ABsvbt0fpAvhMaIAZgaGXC8nfAdFidpohupL37Vk-_T2hw7b4YRXIfu5vVaIAiAn5CNuQ6t1NNphI")', filter: 'hue-rotate(90deg) brightness(1.5)'}}></div>
                  </td>
                </tr>
                {/* Row 4 */}
                <tr className="group hover:bg-surface-highlight/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-surface-highlight p-2 rounded-lg text-text-muted mr-3 font-bold group-hover:bg-primary group-hover:text-white transition-colors">FPT</div>
                      <span className="text-white font-bold">FPT</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">FPT Corp</div>
                    <div className="text-xs text-text-muted">Technology</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-bold text-white">95,000 ₫</div>
                    <div className="text-xs text-emerald-400 flex justify-end items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">arrow_upward</span> 2.1%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-white">2.1%</span>
                        <span className="text-xs text-text-muted">Target: 7%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-highlight rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      35%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-text-muted">Semi-Annual</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-8 w-16 bg-contain bg-center bg-no-repeat opacity-80" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAdOvSaYkJGyHdnere-xlBsVp46VHdZEm__I8N1_9H-vxXcbTfwcLvTkQriBknB-8omDtPn6KS_q7881IeK-JkwlzsgLN-U8I30MsK6JzoOYs9C3jIJRv0pmWIaFze-TYrFKwzym-WW_NRfzAPHMk-7NmblgOcgd872cEw7xeHMGxFlQuw68ZXxNkQs4XCf-RvnjvAMuR35UjIVqRzbS4mP0KO3wK9c2kJRRf2ZsC4S8xhQkh_PdZpoOu5kFekv6smyvIDasNPcCCr5")', filter: 'hue-rotate(90deg) brightness(1.5)'}}></div>
                  </td>
                </tr>
                {/* Row 5 */}
                <tr className="group hover:bg-surface-highlight/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-surface-highlight p-2 rounded-lg text-text-muted mr-3 font-bold group-hover:bg-primary group-hover:text-white transition-colors">REE</div>
                      <span className="text-white font-bold">REE</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">Ree Corp</div>
                    <div className="text-xs text-text-muted">Utilities</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-bold text-white">60,200 ₫</div>
                    <div className="text-xs text-text-muted flex justify-end items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">remove</span> 0.0%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-white">3.4%</span>
                        <span className="text-xs text-text-muted">Target: 7%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-highlight rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: '48%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      40%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-text-muted">Quarterly</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-8 w-16 bg-contain bg-center bg-no-repeat opacity-80" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxRuWpm0Gt29uupgHUFH3tLokYAbIMJR-aPqSAMC0JJAhEwJw6CEeHKbXW03ARU1mmrV0G1S_9KwcyXGXx0QYd_Utx8jU5KAGiYdbGRz22PWbDuidBKJvXpGPCc_6J4uFLg8YRIoF8goO9cMdnSS1nEMCDSP4yaQH6CrMHTbph2FdMCM4M7x2b1Qvkmddf_Zjlombgra-dJ3UaY5-Z-qgXgKXCfwza4g9_KIbIgS5YU_utdvGMz4IuXTF1Nz2g5zMSSymUucy0E5RZ")', filter: 'hue-rotate(90deg) brightness(1.5)'}}></div>
                  </td>
                </tr>
                {/* Row 6 */}
                <tr className="group hover:bg-surface-highlight/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-primary/20 p-2 rounded-lg text-primary mr-3 font-bold group-hover:bg-primary group-hover:text-white transition-colors">GAS</div>
                      <span className="text-white font-bold">GAS</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">PV Gas</div>
                    <div className="text-xs text-text-muted">Energy</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-bold text-white">78,900 ₫</div>
                    <div className="text-xs text-emerald-400 flex justify-end items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">arrow_upward</span> 0.3%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-white">4.8%</span>
                        <span className="text-xs text-text-muted">Target: 7%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-highlight rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      60%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-text-muted">Semi-Annual</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-8 w-16 bg-contain bg-center bg-no-repeat opacity-80" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwdTBneaTCGAp195YK0NKAqGUTN1sSGjwqNVuGlwBDEDFpnq-SGwRfpRKJrJf-9MNNpQUQHVEgctILFodfCCEl76ONZ3o6Nt38JL7uz02pVTJ7hlWZ3WVQQS-XcfPpqkkBgM00tW3N56CtOM_v1-VPgl7n1tJQLHd3B8rP1gvDRWz9Cj9LvYB3rIzdTDAhIIrgdzWomMzsYBtLLdL9AkX60M4joQReKkiV-kC6IVPzl7W5h1aIETBbRGIfSn5N5pepuJGBg-uvaUzZ")', filter: 'hue-rotate(90deg) brightness(1.5)'}}></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-highlight bg-surface-dark">
            <div className="flex flex-1 justify-between sm:hidden">
              <a className="relative inline-flex items-center rounded-md border border-surface-highlight bg-background-dark px-4 py-2 text-sm font-medium text-text-muted hover:bg-surface-highlight hover:text-white" href="#">Previous</a>
              <a className="relative ml-3 inline-flex items-center rounded-md border border-surface-highlight bg-background-dark px-4 py-2 text-sm font-medium text-text-muted hover:bg-surface-highlight hover:text-white" href="#">Next</a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-text-muted">
                  Showing <span className="font-bold text-white">1</span> to <span className="font-bold text-white">6</span> of <span className="font-bold text-white">97</span> results
                </p>
              </div>
              <div>
                <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <a className="relative inline-flex items-center rounded-l-md px-2 py-2 text-text-muted ring-1 ring-inset ring-surface-highlight hover:bg-surface-highlight focus:z-20 focus:outline-offset-0" href="#">
                    <span className="sr-only">Previous</span>
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </a>
                  <a aria-current="page" className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href="#">1</a>
                  <a className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text-muted ring-1 ring-inset ring-surface-highlight hover:bg-surface-highlight hover:text-white focus:z-20 focus:outline-offset-0" href="#">2</a>
                  <a className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text-muted ring-1 ring-inset ring-surface-highlight hover:bg-surface-highlight hover:text-white focus:z-20 focus:outline-offset-0" href="#">3</a>
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text-muted ring-1 ring-inset ring-surface-highlight focus:outline-offset-0">...</span>
                  <a className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text-muted ring-1 ring-inset ring-surface-highlight hover:bg-surface-highlight hover:text-white focus:z-20 focus:outline-offset-0" href="#">10</a>
                  <a className="relative inline-flex items-center rounded-r-md px-2 py-2 text-text-muted ring-1 ring-inset ring-surface-highlight hover:bg-surface-highlight focus:z-20 focus:outline-offset-0" href="#">
                    <span className="sr-only">Next</span>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
