import React, { useState, useCallback } from 'react';
import GrahamScatter from './charts/graham/GrahamScatter';
import GrahamBubble from './charts/graham/GrahamBubble';
import GrahamSectorDonut from './charts/graham/GrahamSectorDonut';
import DatePicker from './ui/DatePicker';

/* ── Types ─────────────────────────────────────────────────── */
interface GrahamResultItem {
  symbol: string;
  gics_industry: string | null;
  date: string;
  close_price: number;
  eps: number;
  bvps: number;
  pe: number | null;
  pb: number | null;
  graham_number: number | null;
  margin_of_safety: number | null;
  eps_positive_years: number;
}

interface ScatterPoint { symbol: string; pe: number; margin_of_safety: number; }
interface BubblePoint { symbol: string; pe: number; pb: number; graham_number: number; }
interface SectorSlice { industry: string; count: number; percentage: number; }

interface FilterResponse {
  items: GrahamResultItem[];
  total: number;
  page: number;
  page_size: number;
  filter_date: string;
  chart_scatter: ScatterPoint[];
  chart_bubble: BubblePoint[];
  chart_sectors: SectorSlice[];
}

interface FilterCriteria {
  eps_consecutive_years: number;
  pe_max: number | null;
  pb_max: number | null;
  graham_gt_price: boolean;
  margin_of_safety_min: number;
}

/* ── Default criteria (team research) ──────────────────────── */
const DEFAULT_CRITERIA: FilterCriteria = {
  eps_consecutive_years: 10,
  pe_max: 15.0,
  pb_max: 1.5,
  graham_gt_price: true,
  margin_of_safety_min: 0.20,
};

const API_BASE = 'http://localhost:8000/api/v1';

export default function ValueFilter() {
  /* ── State ───────────────────────────────────────────────── */
  const [selectedDate, setSelectedDate] = useState('');
  const [criteria, setCriteria] = useState<FilterCriteria>({ ...DEFAULT_CRITERIA });
  const [toggles, setToggles] = useState({
    eps: true, pe: true, pb: true, graham: true, mos: true,
  });
  const [results, setResults] = useState<FilterResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('margin_of_safety');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const canRun = selectedDate.length > 0;

  /* ── Handlers ────────────────────────────────────────────── */
  const toggleCriterion = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const runFilter = useCallback(async (pageNum = 1) => {
    if (!canRun) return;
    setLoading(true);
    setError('');
    setPage(pageNum);

    const body = {
      date: selectedDate,
      eps_consecutive_years: toggles.eps ? criteria.eps_consecutive_years : 1,
      pe_max: toggles.pe ? criteria.pe_max : null,
      pb_max: toggles.pb ? criteria.pb_max : null,
      graham_gt_price: toggles.graham,
      margin_of_safety_min: toggles.mos ? criteria.margin_of_safety_min : -1.0,
      sort_by: sortBy,
      sort_order: sortOrder,
      page: pageNum,
      page_size: 50,
    };

    try {
      const res = await fetch(`${API_BASE}/filters/value`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: FilterResponse = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, criteria, toggles, sortBy, sortOrder, canRun]);

  const resetCriteria = () => {
    setCriteria({ ...DEFAULT_CRITERIA });
    setToggles({ eps: true, pe: true, pb: true, graham: true, mos: true });
  };

  /* ── Criterion card ──────────────────────────────────────── */
  const CriterionCard = ({
    label, description, active, onToggle, children,
  }: {
    label: string; description: string; active: boolean;
    onToggle: () => void; children?: React.ReactNode;
  }) => (
    <div className={`bg-surface-alt p-5 rounded-xl border transition-all ${active ? 'border-primary/50 shadow-md shadow-primary/5' : 'border-line opacity-60'
      }`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-heading font-bold">{label}</h4>
        <button
          onClick={onToggle}
          className={`relative w-11 h-6 rounded-full transition-colors ${active ? 'bg-primary' : 'bg-el'
            }`}
        >
          <span className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${active ? 'translate-x-5' : ''
            }`} />
        </button>
      </div>
      <p className="text-muted text-xs mb-3">{description}</p>
      {active && children}
    </div>
  );

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-page relative">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-sidebar/90 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="lg:hidden"><span className="material-symbols-outlined text-heading cursor-pointer">menu</span></div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded bg-el text-primary"><span className="material-symbols-outlined">candlestick_chart</span></div>
            <h2 className="text-heading text-xl font-bold tracking-tight">Bộ lọc Benjamin Graham</h2>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-10 space-y-8">
        {/* ── Intro + Date picker + Run button ─────────────── */}
        <div className="bg-surface-alt border border-line rounded-xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="max-w-2xl">
              <h1 className="text-2xl lg:text-3xl font-black text-heading mb-2 tracking-tight">
                Chiến lược Benjamin Graham
              </h1>
              <p className="text-muted text-sm leading-relaxed">
                Áp dụng triết lý đầu tư giá trị của Benjamin Graham — tìm kiếm doanh nghiệp có nền tảng tài chính vững chắc,
                đang bị thị trường định giá thấp hơn giá trị nội tại.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-xs font-medium uppercase tracking-wider">Ngày lấy danh mục</label>
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  placeholder="Chọn ngày lấy danh mục..."
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
          </div>
        </div>

        {/* ── Filter criteria ──────────────────────────────── */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* EPS liên tục */}
            <CriterionCard
              label="EPS > 0 liên tục"
              description="Lợi nhuận trên mỗi cổ phiếu dương liên tục qua nhiều năm"
              active={toggles.eps}
              onToggle={() => toggleCriterion('eps')}
            >
              <div className="flex items-center gap-3">
                <input
                  type="range" min={1} max={20} step={1}
                  value={criteria.eps_consecutive_years}
                  onChange={(e) => setCriteria(c => ({ ...c, eps_consecutive_years: +e.target.value }))}
                  className="flex-1 h-1.5 bg-el rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                />
                <span className="text-heading font-bold text-lg min-w-[3ch] text-right">{criteria.eps_consecutive_years}</span>
                <span className="text-muted text-xs">năm</span>
              </div>
            </CriterionCard>

            {/* P/E */}
            <CriterionCard
              label="P/E ≤ 15"
              description="Tỷ số giá / thu nhập — thước đo định giá cổ phiếu"
              active={toggles.pe}
              onToggle={() => toggleCriterion('pe')}
            >
              <div className="flex items-center gap-3">
                <input
                  type="range" min={1} max={50} step={0.5}
                  value={criteria.pe_max ?? 15}
                  onChange={(e) => setCriteria(c => ({ ...c, pe_max: +e.target.value }))}
                  className="flex-1 h-1.5 bg-el rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                />
                <span className="text-heading font-bold text-lg min-w-[3ch] text-right">≤ {criteria.pe_max}</span>
              </div>
            </CriterionCard>

            {/* P/B */}
            <CriterionCard
              label="P/B ≤ 1.5"
              description="Tỷ số giá / giá trị sổ sách — đánh giá tài sản ròng"
              active={toggles.pb}
              onToggle={() => toggleCriterion('pb')}
            >
              <div className="flex items-center gap-3">
                <input
                  type="range" min={0.1} max={10} step={0.1}
                  value={criteria.pb_max ?? 1.5}
                  onChange={(e) => setCriteria(c => ({ ...c, pb_max: +e.target.value }))}
                  className="flex-1 h-1.5 bg-el rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                />
                <span className="text-heading font-bold text-lg min-w-[3ch] text-right">≤ {criteria.pb_max}</span>
              </div>
            </CriterionCard>

            {/* Graham Number > Price */}
            <CriterionCard
              label="Graham Number > Giá"
              description="Giá trị nội tại V = √(22.5 × EPS × BVPS) phải lớn hơn giá thị trường"
              active={toggles.graham}
              onToggle={() => toggleCriterion('graham')}
            />

            {/* Margin of Safety */}
            <CriterionCard
              label="Biên an toàn ≥ 20%"
              description="(V − Price) / V — mức chênh lệch bảo vệ nhà đầu tư"
              active={toggles.mos}
              onToggle={() => toggleCriterion('mos')}
            >
              <div className="flex items-center gap-3">
                <input
                  type="range" min={0} max={80} step={1}
                  value={Math.round(criteria.margin_of_safety_min * 100)}
                  onChange={(e) => setCriteria(c => ({ ...c, margin_of_safety_min: +e.target.value / 100 }))}
                  className="flex-1 h-1.5 bg-el rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                />
                <span className="text-heading font-bold text-lg min-w-[3ch] text-right">≥ {Math.round(criteria.margin_of_safety_min * 100)}%</span>
              </div>
            </CriterionCard>
          </div>
        </div>

        {/* ── Error ────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* ── Results table ────────────────────────────────── */}
        {results && (
          <div className="bg-surface-alt border border-line rounded-xl overflow-hidden shadow-xl shadow-black/10">
            <div className="p-5 border-b border-line flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-heading text-lg font-bold">Kết quả lọc</h3>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                  {results.total} cổ phiếu
                </span>
                <span className="text-muted text-xs">Ngày: {results.filter_date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted text-sm">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); }}
                  className="bg-card border-none text-heading text-sm font-medium rounded-lg focus:ring-1 focus:ring-primary py-1.5 pl-3 pr-8 cursor-pointer"
                >
                  <option value="margin_of_safety">Biên an toàn</option>
                  <option value="pe">P/E thấp nhất</option>
                  <option value="pb">P/B thấp nhất</option>
                  <option value="graham_number">Graham Number</option>
                  <option value="eps">EPS cao nhất</option>
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
                <p className="text-muted text-lg font-medium">Không có cổ phiếu nào thỏa mãn tiêu chí lọc</p>
                <p className="text-muted text-sm mt-1">Thử nới lỏng một số điều kiện hoặc chọn ngày khác</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-card text-muted font-medium uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-5 py-3">#</th>
                        <th className="px-5 py-3">Mã CP</th>
                        <th className="px-5 py-3">Ngành</th>
                        <th className="px-5 py-3 text-right">Giá</th>
                        <th className="px-5 py-3 text-right">EPS</th>
                        <th className="px-5 py-3 text-right">BVPS</th>
                        <th className="px-5 py-3 text-right">P/E</th>
                        <th className="px-5 py-3 text-right">P/B</th>
                        <th className="px-5 py-3 text-right">Graham No.</th>
                        <th className="px-5 py-3 text-right text-primary">Biên an toàn</th>
                        <th className="px-5 py-3 text-center">EPS+</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {results.items.map((item, idx) => (
                        <tr key={item.symbol} className="group hover:bg-card/50 transition-colors">
                          <td className="px-5 py-3 text-muted text-xs">{(results.page - 1) * results.page_size + idx + 1}</td>
                          <td className="px-5 py-3 font-bold text-heading group-hover:text-primary transition-colors">{item.symbol}</td>
                          <td className="px-5 py-3 text-muted text-xs max-w-[200px] truncate">{item.gics_industry || '—'}</td>
                          <td className="px-5 py-3 text-right text-heading font-medium">{item.close_price.toLocaleString()}</td>
                          <td className="px-5 py-3 text-right text-heading">{item.eps.toFixed(2)}</td>
                          <td className="px-5 py-3 text-right text-heading">{item.bvps.toFixed(2)}</td>
                          <td className="px-5 py-3 text-right text-heading">{item.pe?.toFixed(1) ?? '—'}</td>
                          <td className="px-5 py-3 text-right text-heading">{item.pb?.toFixed(2) ?? '—'}</td>
                          <td className="px-5 py-3 text-right text-heading font-medium">{item.graham_number?.toFixed(1) ?? '—'}</td>
                          <td className="px-5 py-3 text-right">
                            {item.margin_of_safety !== null ? (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border ${item.margin_of_safety >= 0.3
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : item.margin_of_safety >= 0.2
                                  ? 'bg-primary/10 text-primary border-primary/20'
                                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                }`}>
                                {(item.margin_of_safety * 100).toFixed(1)}%
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span className="px-2 py-0.5 rounded bg-el text-heading text-xs font-bold">
                              {item.eps_positive_years}y
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {results.total > results.page_size && (
                  <div className="p-4 border-t border-line flex justify-center items-center gap-2">
                    <button
                      onClick={() => runFilter(page - 1)}
                      disabled={page <= 1}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-el hover:bg-card disabled:opacity-40 text-heading transition-colors"
                    >
                      ← Trước
                    </button>
                    <span className="text-muted text-sm px-3">
                      Trang {results.page} / {Math.ceil(results.total / results.page_size)}
                    </span>
                    <button
                      onClick={() => runFilter(page + 1)}
                      disabled={page >= Math.ceil(results.total / results.page_size)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-el hover:bg-card disabled:opacity-40 text-heading transition-colors"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Empty state (before running filter) ──────────── */}
        {!results && !loading && (
          <div className="bg-surface-alt border border-dashed border-line rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-muted mb-4 block">filter_alt</span>
            <p className="text-heading text-lg font-bold mb-2">Chưa có kết quả</p>
            <p className="text-muted text-sm">Chọn ngày và bấm <strong>"Chạy bộ lọc"</strong> để bắt đầu sàng lọc cổ phiếu.</p>
          </div>
        )}

        {/* ── Charts ───────────────────────────────────────── */}
        {results && results.items.length > 0 && (
          <div className="space-y-6">
            <GrahamScatter data={results.chart_scatter} />
            <GrahamBubble data={results.chart_bubble} />
            <div className="max-w-2xl mx-auto">
              <GrahamSectorDonut data={results.chart_sectors} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-6 border-t border-line flex flex-col md:flex-row justify-between items-center text-muted text-sm">
          <p>© 2024 TopInvestment. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
