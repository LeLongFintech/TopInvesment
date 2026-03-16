import React, { useState, useCallback, Suspense, lazy } from 'react';
import DatePicker from '../components/ui/DatePicker';
import { fetchCanslimFilter, fetchCanslimStockDetail } from '../api/canslimApi';

const EpsQuarterlyCombo = lazy(() => import('../components/charts/canslim/EpsQuarterlyCombo'));
const EpsAnnualGrowth = lazy(() => import('../components/charts/canslim/EpsAnnualGrowth'));
const RoeGauge = lazy(() => import('../components/charts/canslim/RoeGauge'));
const VolumeObv = lazy(() => import('../components/charts/canslim/VolumeObv'));
const PriceMaChart = lazy(() => import('../components/charts/canslim/PriceMaChart'));
const RsLineChart = lazy(() => import('../components/charts/canslim/RsLineChart'));
const IndustryHeatmap = lazy(() => import('../components/charts/canslim/IndustryHeatmap'));

/* ── Types ─────────────────────────────────────────────────── */
interface CanslimResultItem {
  symbol: string;
  gics_industry: string | null;
  date: string;
  close_price: number;
  delta_eps_quarterly: number | null;
  delta_sales: number | null;
  net_profit_margin: number | null;
  roe: number | null;
  sgr: number | null;
  rs_score: number | null;
  raw_eps: number | null;
  raw_ad: number | null;
  delta_vol: number | null;
  rs_rating: number;
  eps_rating: number;
  smr_rating: number;
  ad_rating: number;
  cr_score: number;
}

interface FilterResponse {
  items: CanslimResultItem[];
  total: number;
  page: number;
  page_size: number;
  filter_date: string;
  layer1_count: number;
  layer2_count: number;
}

interface FilterCriteria {
  delta_eps_min: number;
  delta_sales_min: number;
  roe_min: number;
  rs_rating_min: number;
}

/* ── Defaults ──────────────────────────────────────────────── */
const DEFAULT_CRITERIA: FilterCriteria = {
  delta_eps_min: 20.0,
  delta_sales_min: 25.0,
  roe_min: 0.17,
  rs_rating_min: 80,
};

/* ── Helpers ───────────────────────────────────────────────── */
function ratingBadge(value: number) {
  const bg =
    value >= 90 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 ring-1 ring-blue-500/20'
    : value >= 70 ? 'bg-green-500/20 text-green-400 border-green-500/30'
    : value >= 50 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    : 'bg-red-500/20 text-red-400 border-red-500/30';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${bg}`}>
      {value >= 90 && <span className="mr-0.5">★</span>}
      {value}
    </span>
  );
}

function fmt(val: number | null | undefined, decimals = 2, suffix = '') {
  if (val === null || val === undefined) return '—';
  return val.toFixed(decimals) + suffix;
}

export default function CanslimFilter() {
  /* ── State ───────────────────────────────────────────────── */
  const [selectedDate, setSelectedDate] = useState('');
  const [criteria, setCriteria] = useState<FilterCriteria>({ ...DEFAULT_CRITERIA });
  const [results, setResults] = useState<FilterResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('cr_score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  // Drill-down state
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const canRun = selectedDate.length > 0;

  /* ── Handlers ────────────────────────────────────────────── */
  const runFilter = useCallback(async (pageNum = 1) => {
    if (!canRun) return;
    setLoading(true);
    setError('');
    setPage(pageNum);

    const body = {
      date: selectedDate,
      delta_eps_min: criteria.delta_eps_min,
      delta_sales_min: criteria.delta_sales_min,
      roe_min: criteria.roe_min,
      rs_rating_min: criteria.rs_rating_min,
      sort_by: sortBy,
      sort_order: sortOrder,
      page: pageNum,
      page_size: 50,
    };

    try {
      const data: FilterResponse = await fetchCanslimFilter(body);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, criteria, sortBy, sortOrder, canRun]);

  const resetCriteria = () => setCriteria({ ...DEFAULT_CRITERIA });

  const openStockDetail = useCallback(async (symbol: string) => {
    if (selectedSymbol === symbol) { setSelectedSymbol(null); setDetailData(null); return; }
    setSelectedSymbol(symbol);
    setDetailLoading(true);
    try {
      const data = await fetchCanslimStockDetail(symbol, 2);
      setDetailData(data);
    } catch { setDetailData(null); }
    finally { setDetailLoading(false); }
  }, [selectedSymbol]);

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <main className="flex-1 p-8 overflow-y-auto h-screen bg-page">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tight text-heading">
              Bộ lọc <span className="text-primary">CANSLIM</span>
            </h1>
            <p className="text-muted text-base max-w-2xl">
              Sàng lọc cổ phiếu tăng trưởng theo chiến lược CANSLIM của William O'Neil — 2 lớp lọc: điều kiện cứng → xếp hạng bách phân vị → chỉ số CR tổng hợp.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-muted text-xs font-medium uppercase tracking-wider">Ngày tham chiếu</label>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Chọn ngày tham chiếu..."
              />
            </div>
            <button
              onClick={() => runFilter(1)}
              disabled={!canRun || loading}
              className={`flex items-center gap-2 h-10 px-6 rounded-lg text-white font-bold text-sm transition-all mt-5 ${canRun && !loading
                ? 'bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 cursor-pointer'
                : 'bg-gray-500 opacity-50 cursor-not-allowed'
                }`}
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>Đang lọc...</>
              ) : (
                <><span className="material-symbols-outlined text-sm">play_arrow</span>Chạy bộ lọc</>
              )}
            </button>
          </div>
        </header>

        {/* Filters Grid */}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Criteria Card: Earnings */}
            <div className="bg-card rounded-xl p-6 border border-line/30 flex flex-col gap-5 shadow-lg">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">monetization_on</span>
                </div>
                <h3 className="text-lg font-bold text-heading">Earnings Growth</h3>
              </div>
              {/* Delta EPS Quarterly */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-heading">Current Earnings (C)</span>
                    <span className="text-xs text-muted">Tăng trưởng EPS quý YoY</span>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    ≥ {criteria.delta_eps_min}%
                  </span>
                </div>
                <input
                  type="range" min={5} max={50} step={1}
                  value={criteria.delta_eps_min}
                  onChange={e => setCriteria(c => ({ ...c, delta_eps_min: +e.target.value }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted">
                  <span>5%</span><span>25%</span><span>50%</span>
                </div>
              </div>
              <div className="w-full h-px bg-heading/5" />
              {/* Delta Sales */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-heading">Annual Sales (A)</span>
                    <span className="text-xs text-muted">Tăng trưởng doanh thu YoY</span>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    ≥ {criteria.delta_sales_min}%
                  </span>
                </div>
                <input
                  type="range" min={5} max={60} step={1}
                  value={criteria.delta_sales_min}
                  onChange={e => setCriteria(c => ({ ...c, delta_sales_min: +e.target.value }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted">
                  <span>5%</span><span>30%</span><span>60%</span>
                </div>
              </div>
            </div>

            {/* Criteria Card: Fundamentals */}
            <div className="bg-card rounded-xl p-6 border border-line/30 flex flex-col gap-5 shadow-lg">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <h3 className="text-lg font-bold text-heading">Fundamentals</h3>
              </div>
              {/* ROE */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-heading">ROE tối thiểu</span>
                    <span className="text-xs text-muted">Tỷ suất lợi nhuận trên vốn chủ sở hữu</span>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    ≥ {(criteria.roe_min * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range" min={5} max={40} step={1}
                  value={criteria.roe_min * 100}
                  onChange={e => setCriteria(c => ({ ...c, roe_min: +e.target.value / 100 }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted">
                  <span>5%</span><span>20%</span><span>40%</span>
                </div>
              </div>
            </div>

            {/* Criteria Card: Technicals */}
            <div className="bg-card rounded-xl p-6 border border-line/30 flex flex-col gap-5 shadow-lg">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">candlestick_chart</span>
                </div>
                <h3 className="text-lg font-bold text-heading">Technical Strength</h3>
              </div>
              {/* RS Rating */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-heading">RS Rating (S)</span>
                    <span className="text-xs text-muted">Xếp hạng sức mạnh giá tương đối</span>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    ≥ {criteria.rs_rating_min}
                  </span>
                </div>
                <input
                  type="range" min={1} max={99} step={1}
                  value={criteria.rs_rating_min}
                  onChange={e => setCriteria(c => ({ ...c, rs_rating_min: +e.target.value }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted">
                  <span>1</span><span>50</span><span>99</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Error ────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* ── Empty state ──────────────────────────────────── */}
        {!results && !loading && (
          <div className="bg-surface-alt border border-dashed border-line rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-muted mb-4 block">filter_alt</span>
            <p className="text-heading text-lg font-bold mb-2">Chưa có kết quả</p>
            <p className="text-muted text-sm">
              Chọn ngày tham chiếu và bấm <strong>"Chạy bộ lọc"</strong> để bắt đầu sàng lọc cổ phiếu theo chiến lược CANSLIM.
            </p>
          </div>
        )}

        {/* ── Results Section ──────────────────────────────── */}
        {results && (
          <div className="flex flex-col gap-4">
            {/* Stats bar */}
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-xl font-bold text-heading flex items-center gap-2">
                Kết quả lọc
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                {results.total} cổ phiếu
              </span>
              <span className="text-muted text-xs">Ngày: {results.filter_date}</span>
              <div className="flex gap-3 ml-auto text-xs">
                <span className="px-2 py-1 rounded bg-heading/5 text-muted border border-heading/10">
                  Lớp 1: <span className="font-bold text-heading">{results.layer1_count}</span> CP
                </span>
                <span className="px-2 py-1 rounded bg-heading/5 text-muted border border-heading/10">
                  Lớp 2 (RS≥{criteria.rs_rating_min}): <span className="font-bold text-heading">{results.layer2_count}</span> CP
                </span>
              </div>
            </div>

            {/* Sort controls */}
            <div className="flex items-center gap-3">
              <span className="text-muted text-sm">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-card border-none text-heading text-sm font-medium rounded-lg focus:ring-1 focus:ring-primary py-1.5 pl-3 pr-8 cursor-pointer"
              >
                <option value="cr_score">CR Score</option>
                <option value="rs_rating">RS Rating</option>
                <option value="eps_rating">EPS Rating</option>
                <option value="smr_rating">SMR Rating</option>
                <option value="ad_rating">A/D Rating</option>
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

            {/* Table */}
            <div className="bg-card rounded-xl border border-line/30 overflow-hidden shadow-lg">
              {results.items.length === 0 ? (
                <div className="p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-muted mb-3 block">search_off</span>
                  <p className="text-muted text-lg font-medium">Không có cổ phiếu nào thỏa mãn tiêu chí</p>
                  <p className="text-muted text-sm mt-1">Thử nới lỏng điều kiện (giảm ngưỡng EPS, Sales, ROE hoặc RS Rating)</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                      <thead>
                        <tr className="bg-heading/5 border-b border-line/50 text-muted text-xs uppercase tracking-wider">
                          <th className="p-4 font-semibold">#</th>
                          <th className="p-4 font-semibold">Mã CP</th>
                          <th className="p-4 font-semibold">Ngành</th>
                          <th className="p-4 font-semibold text-right">Giá</th>
                          <th className="p-4 font-semibold text-right">ΔEPS Quý</th>
                          <th className="p-4 font-semibold text-right">ΔSales</th>
                          <th className="p-4 font-semibold text-right">ROE</th>
                          <th className="p-4 font-semibold text-center">RS</th>
                          <th className="p-4 font-semibold text-center">EPS</th>
                          <th className="p-4 font-semibold text-center">SMR</th>
                          <th className="p-4 font-semibold text-center">A/D</th>
                          <th className="p-4 font-semibold text-center text-primary">CR</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-line/20">
                        {results.items.map((item, idx) => (
                          <tr
                            key={item.symbol}
                            onClick={() => openStockDetail(item.symbol)}
                            className={`group hover:bg-heading/5 transition-colors cursor-pointer ${selectedSymbol === item.symbol ? 'bg-primary/5 ring-1 ring-primary/30' : ''}`}
                          >
                            <td className="p-4 text-muted text-xs">
                              {(results.page - 1) * results.page_size + idx + 1}
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-heading flex items-center gap-2">
                                <span className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                                  {item.symbol.slice(0, 2)}
                                </span>
                                {item.symbol}
                              </div>
                            </td>
                            <td className="p-4 text-muted text-xs max-w-[180px] truncate">
                              {item.gics_industry || '—'}
                            </td>
                            <td className="p-4 text-right text-heading font-medium">
                              {item.close_price.toLocaleString()}
                            </td>
                            <td className="p-4 text-right">
                              <span className={item.delta_eps_quarterly && item.delta_eps_quarterly >= 25 ? 'text-green-400 font-bold' : 'text-heading'}>
                                {fmt(item.delta_eps_quarterly, 1, '%')}
                              </span>
                            </td>
                            <td className="p-4 text-right text-heading">{fmt(item.delta_sales, 1, '%')}</td>
                            <td className="p-4 text-right text-heading">
                              {item.roe !== null ? (item.roe * 100).toFixed(1) + '%' : '—'}
                            </td>
                            <td className="p-4 text-center">{ratingBadge(item.rs_rating)}</td>
                            <td className="p-4 text-center">{ratingBadge(item.eps_rating)}</td>
                            <td className="p-4 text-center">{ratingBadge(item.smr_rating)}</td>
                            <td className="p-4 text-center">{ratingBadge(item.ad_rating)}</td>
                            <td className="p-4 text-center">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-black border ${
                                item.cr_score >= 80 ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : item.cr_score >= 60 ? 'bg-primary/10 text-primary border-primary/20'
                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              }`}>
                                {item.cr_score.toFixed(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {results.total > results.page_size && (
                    <div className="p-4 border-t border-line/50 flex items-center justify-between bg-heading/5">
                      <span className="text-xs text-muted">
                        Trang <span className="font-bold text-heading">{results.page}</span> / <span className="font-bold text-heading">{Math.ceil(results.total / results.page_size)}</span>
                        {' '}• <span className="font-bold text-heading">{results.total}</span> kết quả
                      </span>
                      <div className="flex items-center gap-2">
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
          </div>
        )}

        {/* ── Khu vực 2: Top ngành dẫn dắt ──────────────── */}
        {results && results.items.length > 0 && (() => {
          const industryMap = new Map<string, { count: number; rsSum: number; crSum: number }>();
          results.items.forEach(item => {
            const ind = item.gics_industry || 'Chưa phân loại';
            const prev = industryMap.get(ind) || { count: 0, rsSum: 0, crSum: 0 };
            industryMap.set(ind, {
              count: prev.count + 1,
              rsSum: prev.rsSum + item.rs_rating,
              crSum: prev.crSum + item.cr_score,
            });
          });
          const industries = Array.from(industryMap.entries())
            .map(([name, d]) => ({
              name,
              count: d.count,
              avgRS: d.rsSum / d.count,
              avgCR: d.crSum / d.count,
            }))
            .sort((a, b) => b.avgRS - a.avgRS)
            .slice(0, 10);
          const maxRS = Math.max(...industries.map(i => i.avgRS), 1);

          return (
            <div className="bg-surface-alt border border-line rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-line bg-sidebar flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">leaderboard</span>
                <h3 className="text-heading font-bold text-lg">Top ngành dẫn dắt</h3>
                <span className="ml-auto text-muted text-xs">{industries.length} ngành • Xếp theo RS Rating trung bình</span>
              </div>
              <div className="p-6 space-y-3">
                {industries.map((ind, idx) => (
                  <div key={ind.name} className="flex items-center gap-4">
                    <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-black shrink-0 ${
                      idx === 0 ? 'bg-yellow-500/20 text-yellow-400 ring-2 ring-yellow-500/30'
                      : idx === 1 ? 'bg-gray-400/20 text-gray-300 ring-2 ring-gray-400/30'
                      : idx === 2 ? 'bg-orange-500/20 text-orange-400 ring-2 ring-orange-500/30'
                      : 'bg-el text-muted'
                    }`}>{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-heading text-sm font-semibold truncate">{ind.name}</span>
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          <span className="text-xs text-muted">{ind.count} CP</span>
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                            ind.avgRS >= 90 ? 'bg-blue-500/20 text-blue-400'
                            : ind.avgRS >= 80 ? 'bg-green-500/20 text-green-400'
                            : 'bg-primary/20 text-primary'
                          }`}>RS {ind.avgRS.toFixed(0)}</span>
                          <span className="text-xs font-bold text-heading">CR {ind.avgCR.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-el rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            ind.avgRS >= 90 ? 'bg-gradient-to-r from-blue-600 to-blue-400'
                            : ind.avgRS >= 80 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                            : 'bg-gradient-to-r from-primary to-purple-500'
                          }`}
                          style={{ width: `${(ind.avgRS / maxRS) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── Khu vực 7: Industry Heatmap ───────────────── */}
        {results?.industry_leadership?.length > 0 && (
          <Suspense fallback={<div className="h-64 animate-pulse bg-el/30 rounded-xl mt-6" />}>
            <div className="mt-6">
              <IndustryHeatmap data={results.industry_leadership} />
            </div>
          </Suspense>
        )}

        {/* ── Stock Detail Modal ──────────────────────── */}
        {selectedSymbol && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => { setSelectedSymbol(null); setDetailData(null); }}
            />
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-page border border-line rounded-2xl shadow-2xl shadow-black/30 overflow-hidden flex flex-col">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-sidebar shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                  </div>
                  <div>
                    <h3 className="text-heading font-bold text-lg">{selectedSymbol}</h3>
                    <p className="text-muted text-xs">{detailData?.gics_industry || 'Đang tải...'}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedSymbol(null); setDetailData(null); }}
                  className="size-9 rounded-lg bg-el hover:bg-red-500/20 flex items-center justify-center text-muted hover:text-red-400 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              {/* Modal body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {detailLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                    <span className="text-muted ml-3 text-lg">Đang tải dữ liệu phân tích...</span>
                  </div>
                ) : detailData ? (
                  <>
                    {/* Row 1: EPS Quarterly + ROE Gauge */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      <div className="lg:col-span-2">
                        <EpsQuarterlyCombo data={detailData.quarterly_eps || []} />
                      </div>
                      <RoeGauge roe={detailData.current_roe} />
                    </div>
                    {/* Row 2: Annual EPS Growth */}
                    <EpsAnnualGrowth data={detailData.annual_growth || []} />
                    {/* Row 3: Price + MA */}
                    <PriceMaChart data={detailData.daily || []} symbol={selectedSymbol} />
                    {/* Row 4: Volume + OBV */}
                    <VolumeObv data={detailData.daily || []} />
                    {/* Row 5: RS Line + Blue Dots */}
                    <RsLineChart data={detailData.daily || []} symbol={selectedSymbol} />
                  </>
                ) : (
                  <div className="text-center py-20">
                    <span className="material-symbols-outlined text-4xl text-muted mb-3 block">info</span>
                    <p className="text-muted text-lg">Không có dữ liệu cho mã này</p>
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
