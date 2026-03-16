import React, { useState, useCallback } from 'react';
import { fetchDividendFilter, fetchDividendChartDetail } from '../api/dividendApi';
import DividendYieldCombo from '../components/charts/dividend/DividendYieldCombo';
import DcrTrendChart from '../components/charts/dividend/DcrTrendChart';
import DividendScatter from '../components/charts/dividend/DividendScatter';
import DividendSectorHeatmap from '../components/charts/dividend/DividendSectorHeatmap';

/* ── Types ─────────────────────────────────────────────────── */
interface DividendResultItem {
  rank: number;
  symbol: string;
  gics_industry: string | null;
  avg_close_price: number;
  avg_dividend_yield: number;
  avg_coverage_ratio: number;
  latest_dps: number;
  consecutive_dividend_years: number;
}

interface FilterResponse {
  items: DividendResultItem[];
  total: number;
  page: number;
  page_size: number;
  reference_year: number;
  years_analyzed: number;
}

interface FilterCriteria {
  consecutive_years: 3 | 4 | 5;
  dividend_yield_min: number;
  coverage_ratio_min: number;
}

/* ── Defaults ──────────────────────────────────────────────── */
const DEFAULT_CRITERIA: FilterCriteria = {
  consecutive_years: 5,
  dividend_yield_min: 0.05,
  coverage_ratio_min: 1.5,
};



export default function DividendFilter() {
  /* ── State ───────────────────────────────────────────────── */
  const [criteria, setCriteria] = useState<FilterCriteria>({ ...DEFAULT_CRITERIA });
  const [results, setResults] = useState<FilterResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('avg_coverage_ratio');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  // Drill-down charts
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [chartLoading, setChartLoading] = useState(false);

  const openChartDetail = useCallback(async (symbol: string) => {
    if (selectedSymbol === symbol) { setSelectedSymbol(null); setChartData(null); return; }
    setSelectedSymbol(symbol);
    setChartLoading(true);
    try {
      const data = await fetchDividendChartDetail(symbol);
      setChartData(data);
    } catch { setChartData(null); }
    finally { setChartLoading(false); }
  }, [selectedSymbol]);

  /* ── Handlers ────────────────────────────────────────────── */
  const runFilter = useCallback(async (pageNum = 1) => {
    setLoading(true);
    setError('');
    setPage(pageNum);

    const body = {
      consecutive_years: criteria.consecutive_years,
      dividend_yield_min: criteria.dividend_yield_min,
      coverage_ratio_min: criteria.coverage_ratio_min,
      sort_by: sortBy,
      sort_order: sortOrder,
      page: pageNum,
      page_size: 50,
    };

    try {
      const data: FilterResponse = await fetchDividendFilter(body);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  }, [criteria, sortBy, sortOrder]);

  const resetCriteria = () => setCriteria({ ...DEFAULT_CRITERIA });

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-page">
      {/* Gradient background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="px-8 py-8 max-w-[1400px] mx-auto w-full z-10 space-y-8">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary/20 text-primary p-1 rounded-md">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </span>
              <span className="text-muted text-sm font-medium tracking-wide uppercase">Investment Tools</span>
            </div>
            <h2 className="text-heading text-3xl md:text-4xl font-bold tracking-tight">Bộ Lọc Cổ Tức</h2>
            <p className="text-muted text-base max-w-2xl">
              Sàng lọc cổ phiếu trả cổ tức ổn định tại thị trường Thái Lan — ưu tiên doanh nghiệp có hệ số bao phủ cổ tức cao,
              đảm bảo dòng thu nhập thụ động bền vững.
            </p>
          </div>
          <button
            onClick={() => runFilter(1)}
            disabled={loading}
            className={`flex items-center gap-2 h-12 px-8 rounded-xl text-white font-bold text-sm transition-all shadow-lg ${loading
              ? 'bg-gray-500 opacity-50 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-dark shadow-primary/20 cursor-pointer'
              }`}
          >
            {loading ? (
              <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>Đang lọc...</>
            ) : (
              <><span className="material-symbols-outlined text-sm">play_arrow</span>Chạy bộ lọc</>
            )}
          </button>
        </div>

        {/* ── Criteria Cards ─────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">tune</span>Tiêu chí lọc
            </h3>
            <button
              onClick={resetCriteria}
              className="text-xs text-primary hover:text-primary-light font-bold uppercase tracking-wider"
            >
              Reset tất cả
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Consecutive Years */}
            <div className="bg-surface-alt p-5 rounded-xl border border-primary/50 shadow-md shadow-primary/5">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-heading font-bold">Trả cổ tức liên tục</h4>
                <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
              </div>
              <p className="text-muted text-xs mb-4">Số năm liên tục trả cổ tức (tham chiếu từ 2025)</p>
              <div className="flex gap-2">
                {([3, 4, 5] as const).map(n => (
                  <button
                    key={n}
                    onClick={() => setCriteria(c => ({ ...c, consecutive_years: n }))}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${criteria.consecutive_years === n
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-el text-muted hover:bg-card hover:text-heading'
                      }`}
                  >
                    {n} năm
                  </button>
                ))}
              </div>
            </div>

            {/* Dividend Yield */}
            <div className="bg-surface-alt p-5 rounded-xl border border-primary/50 shadow-md shadow-primary/5">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-heading font-bold">Tỷ suất cổ tức TB</h4>
                <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
              </div>
              <p className="text-muted text-xs mb-4">Trung bình qua {criteria.consecutive_years} năm — ngưỡng tối thiểu</p>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={1} max={15} step={0.5}
                  value={criteria.dividend_yield_min * 100}
                  onChange={e => setCriteria(c => ({ ...c, dividend_yield_min: +e.target.value / 100 }))}
                  className="flex-1"
                />
                <span className="text-heading font-bold text-lg min-w-[4ch] text-right">
                  ≥ {(criteria.dividend_yield_min * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Coverage Ratio */}
            <div className="bg-surface-alt p-5 rounded-xl border border-primary/50 shadow-md shadow-primary/5">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-heading font-bold">Hệ số bao phủ TB</h4>
                <span className="material-symbols-outlined text-primary text-sm">shield</span>
              </div>
              <p className="text-muted text-xs mb-4">DCR = Lợi nhuận / Cổ tức — khả năng chi trả bền vững</p>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={0.5} max={5} step={0.1}
                  value={criteria.coverage_ratio_min}
                  onChange={e => setCriteria(c => ({ ...c, coverage_ratio_min: +e.target.value }))}
                  className="flex-1"
                />
                <span className="text-heading font-bold text-lg min-w-[4ch] text-right">
                  ≥ {criteria.coverage_ratio_min.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Error ──────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* ── Empty state (before running filter) ────────────── */}
        {!results && !loading && (
          <div className="bg-surface-alt border border-dashed border-line rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-muted mb-4 block">payments</span>
            <p className="text-heading text-lg font-bold mb-2">Chưa có kết quả</p>
            <p className="text-muted text-sm">Điều chỉnh tiêu chí và bấm <strong>"Chạy bộ lọc"</strong> để sàng lọc cổ phiếu cổ tức.</p>
          </div>
        )}

        {/* ── Results Table ──────────────────────────────────── */}
        {results && (
          <div className="w-full bg-surface rounded-2xl border border-line shadow-xl overflow-hidden">
            {/* Table header */}
            <div className="p-5 border-b border-line flex flex-col md:flex-row justify-between items-center gap-4 bg-el/30">
              <div className="flex items-center gap-3">
                <h3 className="text-heading text-lg font-bold">Kết quả lọc</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                  {results.total} cổ phiếu
                </span>
                <span className="text-muted text-xs">
                  Ref: {results.reference_year} • {results.years_analyzed} năm
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted text-sm">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-card border-none text-heading text-sm font-medium rounded-lg focus:ring-1 focus:ring-primary py-1.5 pl-3 pr-8 cursor-pointer"
                >
                  <option value="avg_coverage_ratio">Hệ số bao phủ TB</option>
                  <option value="avg_dividend_yield">Tỷ suất cổ tức TB</option>
                  <option value="latest_dps">DPS gần nhất</option>
                </select>
                <button
                  onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
                  className="p-2 text-muted hover:text-heading hover:bg-el rounded-lg transition-colors"
                  title={sortOrder === 'desc' ? 'Giảm dần' : 'Tăng dần'}
                >
                  <span className="material-symbols-outlined">
                    {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
                  </span>
                </button>
              </div>
            </div>

            {results.items.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-muted mb-3 block">search_off</span>
                <p className="text-muted text-lg font-medium">Không có cổ phiếu nào thỏa mãn tiêu chí</p>
                <p className="text-muted text-sm mt-1">Thử nới lỏng điều kiện (giảm DY, DCR hoặc chọn ít năm hơn)</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="bg-el/50 border-b border-line">
                        <th className="px-6 py-4 text-center text-xs font-bold text-muted uppercase tracking-wider w-16">Rank</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">Mã CP</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">Ngành</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-muted uppercase tracking-wider">Giá TB (฿)</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider w-56">Tỷ suất cổ tức TB</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-muted uppercase tracking-wider">DCR TB</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-muted uppercase tracking-wider">DPS mới nhất</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-muted uppercase tracking-wider">Liên tục</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {results.items.map(item => (
                        <tr key={item.symbol} onClick={() => openChartDetail(item.symbol)} className="group hover:bg-el/30 transition-colors cursor-pointer">
                          {/* Rank */}
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center justify-center size-8 rounded-full text-xs font-black ${item.rank === 1
                              ? 'bg-yellow-500/20 text-yellow-400 ring-2 ring-yellow-500/30'
                              : item.rank === 2
                                ? 'bg-gray-400/20 text-gray-300 ring-2 ring-gray-400/30'
                                : item.rank === 3
                                  ? 'bg-orange-500/20 text-orange-400 ring-2 ring-orange-500/30'
                                  : 'bg-el text-muted'
                              }`}>
                              {item.rank}
                            </span>
                          </td>

                          {/* Symbol */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-primary/20 p-2 rounded-lg text-primary mr-3 font-bold text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                                {item.symbol.replace('.BK', '')}
                              </div>
                              <span className="text-heading font-bold">{item.symbol}</span>
                            </div>
                          </td>

                          {/* Industry */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-muted text-xs max-w-[180px] truncate block">{item.gics_industry || '—'}</span>
                          </td>

                          {/* Avg Price */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-heading font-bold text-sm">{item.avg_close_price.toLocaleString()}</span>
                          </td>

                          {/* Avg Dividend Yield with progress bar */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-end">
                                <span className="text-sm font-bold text-heading">
                                  {(item.avg_dividend_yield * 100).toFixed(2)}%
                                </span>
                                <span className="text-xs text-muted">
                                  Min: {(criteria.dividend_yield_min * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-el rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${item.avg_dividend_yield >= 0.08
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                    : item.avg_dividend_yield >= 0.05
                                      ? 'bg-gradient-to-r from-primary to-purple-500'
                                      : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                    }`}
                                  style={{ width: `${Math.min(100, (item.avg_dividend_yield / 0.15) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Avg Coverage Ratio */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${item.avg_coverage_ratio >= 3
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : item.avg_coverage_ratio >= 2
                                ? 'bg-primary/10 text-primary border-primary/20'
                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              }`}>
                              {item.avg_coverage_ratio.toFixed(2)}x
                            </span>
                          </td>

                          {/* Latest DPS */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-heading font-medium text-sm">{item.latest_dps.toFixed(2)}</span>
                          </td>

                          {/* Consecutive Years */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                              <span className="material-symbols-outlined text-[14px]">verified</span>
                              {item.consecutive_dividend_years}y
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {results.total > results.page_size && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-line bg-surface">
                    <p className="text-sm text-muted">
                      Trang <span className="font-bold text-heading">{results.page}</span> / <span className="font-bold text-heading">{Math.ceil(results.total / results.page_size)}</span>
                      {' '}• <span className="font-bold text-heading">{results.total}</span> kết quả
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => runFilter(page - 1)}
                        disabled={page <= 1}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-el hover:bg-card disabled:opacity-40 text-heading transition-colors"
                      >
                        ← Trước
                      </button>
                      <button
                        onClick={() => runFilter(page + 1)}
                        disabled={page >= Math.ceil(results.total / results.page_size)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-el hover:bg-card disabled:opacity-40 text-heading transition-colors"
                      >
                        Sau →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Dashboard Charts (overview) ──────────────────── */}
        {results && results.items.length > 0 && (
          <div className="bg-surface-alt border border-line rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-line bg-sidebar flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">dashboard</span>
              <h3 className="text-heading font-bold text-lg">Dashboard Phân Tích — Bộ lọc Cổ tức</h3>
              <span className="ml-auto text-muted text-xs">{results.total} cổ phiếu đạt tiêu chí</span>
            </div>
            <div className="p-5 space-y-5">
              <DividendScatter data={results.items} />
              <DividendSectorHeatmap data={results.items} />
            </div>
          </div>
        )}

        {/* ── Drill-down Modal ────────────────────────────────── */}
        {selectedSymbol && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => { setSelectedSymbol(null); setChartData(null); }}>
            <div className="bg-surface w-full max-w-6xl max-h-[90vh] rounded-2xl border border-line shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-sidebar/50 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-xl">payments</span>
                  </div>
                  <div>
                    <h3 className="text-heading text-lg font-bold">{selectedSymbol}</h3>
                    <p className="text-muted text-xs">Phân tích cổ tức chi tiết</p>
                  </div>
                </div>
                <button onClick={() => { setSelectedSymbol(null); setChartData(null); }} className="p-2 hover:bg-el rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-muted hover:text-heading">close</span>
                </button>
              </div>
              {/* Modal body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {chartLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                    <span className="text-muted ml-3 text-lg">Đang tải dữ liệu...</span>
                  </div>
                ) : chartData?.yearly?.length ? (
                  <div className="space-y-6">
                    <DividendYieldCombo data={chartData.yearly} symbol={selectedSymbol} />
                    <DcrTrendChart data={chartData.yearly} symbol={selectedSymbol} />
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <span className="material-symbols-outlined text-4xl text-muted mb-3 block">info</span>
                    <p className="text-muted text-lg">Không có dữ liệu cổ tức cho mã này</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-6 border-t border-line flex flex-col md:flex-row justify-between items-center text-muted text-sm">
          <p>© 2026 TopInvestment. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
