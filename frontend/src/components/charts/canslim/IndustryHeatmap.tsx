import React, { useMemo } from 'react';

interface StockItem {
  symbol: string;
  gics_industry: string | null;
  rs_rating: number;
  eps_rating: number;
  smr_rating: number;
  ad_rating: number;
  cr_score: number;
}

interface Props {
  items: StockItem[];
}

/* ── Color helpers ────────────────────────────────────── */
function ratingColor(v: number) {
  if (v >= 90) return { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', ring: 'rgba(59,130,246,0.3)' };
  if (v >= 80) return { bg: 'rgba(34,197,94,0.15)', text: '#4ade80', ring: 'rgba(34,197,94,0.3)' };
  if (v >= 70) return { bg: 'rgba(34,197,94,0.10)', text: '#86efac', ring: 'rgba(34,197,94,0.2)' };
  if (v >= 50) return { bg: 'rgba(234,179,8,0.12)', text: '#facc15', ring: 'rgba(234,179,8,0.2)' };
  return { bg: 'rgba(239,68,68,0.12)', text: '#f87171', ring: 'rgba(239,68,68,0.2)' };
}

function letterGrade(v: number) {
  if (v >= 90) return 'A+';
  if (v >= 80) return 'A';
  if (v >= 70) return 'B+';
  if (v >= 60) return 'B';
  if (v >= 50) return 'C';
  return 'D';
}

function crBadgeColor(cr: number) {
  if (cr >= 85) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  if (cr >= 75) return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (cr >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
}

export default function IndustryHeatmap({ items }: Props) {
  const industries = useMemo(() => {
    const map = new Map<string, { stocks: string[]; rs: number[]; eps: number[]; smr: number[]; ad: number[]; cr: number[] }>();
    items.forEach(item => {
      const ind = item.gics_industry || 'Chưa phân loại';
      if (!map.has(ind)) map.set(ind, { stocks: [], rs: [], eps: [], smr: [], ad: [], cr: [] });
      const g = map.get(ind)!;
      g.stocks.push(item.symbol);
      g.rs.push(item.rs_rating);
      g.eps.push(item.eps_rating);
      g.smr.push(item.smr_rating);
      g.ad.push(item.ad_rating);
      g.cr.push(item.cr_score);
    });

    const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    const avgF = (arr: number[]) => +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);

    return Array.from(map.entries())
      .map(([name, d]) => ({
        name,
        count: d.stocks.length,
        stocks: d.stocks,
        rs: avg(d.rs),
        eps: avg(d.eps),
        smr: avg(d.smr),
        ad: avg(d.ad),
        cr: avgF(d.cr),
        overall: avg(d.rs) * 0.35 + avg(d.eps) * 0.35 + avg(d.smr) * 0.2 + avg(d.ad) * 0.1,
      }))
      .sort((a, b) => b.overall - a.overall)
      .slice(0, 10);
  }, [items]);

  if (!industries.length) return null;

  const ratings = [
    { key: 'rs' as const, label: 'RS', desc: 'Relative Strength' },
    { key: 'eps' as const, label: 'EPS', desc: 'Earnings' },
    { key: 'smr' as const, label: 'SMR', desc: 'Sales+Margin+ROE' },
    { key: 'ad' as const, label: 'A/D', desc: 'Accumulation' },
  ];

  return (
    <div className="bg-surface-alt border border-line rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-line bg-sidebar">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">grid_view</span>
            </div>
            <div>
              <h3 className="text-heading font-bold text-lg">Bản đồ nhiệt theo Ngành</h3>
              <p className="text-muted text-xs mt-0.5">Rating trung bình — {industries.length} ngành hàng đầu</p>
            </div>
          </div>
          {/* Legend */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            {[
              { label: '≥90 (A+)', color: '#60a5fa' },
              { label: '≥80 (A)', color: '#4ade80' },
              { label: '≥50 (C)', color: '#facc15' },
              { label: '<50 (D)', color: '#f87171' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                <span className="text-muted">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table header */}
      <div className="px-6 py-3 grid gap-3 border-b border-line/50 text-[11px] uppercase tracking-wider text-muted font-semibold"
        style={{ gridTemplateColumns: '2fr repeat(4, 1fr) 80px' }}
      >
        <div>Ngành</div>
        {ratings.map(r => (
          <div key={r.key} className="text-center">{r.label}</div>
        ))}
        <div className="text-center">CR</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-line/20">
        {industries.map((ind, idx) => (
          <div
            key={ind.name}
            className="px-6 py-3.5 grid gap-3 items-center hover:bg-heading/5 transition-colors group"
            style={{ gridTemplateColumns: '2fr repeat(4, 1fr) 80px' }}
          >
            {/* Industry name + count */}
            <div className="flex items-center gap-3 min-w-0">
              <span className={`flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-black shrink-0 ${
                idx === 0 ? 'bg-yellow-500/20 text-yellow-400'
                : idx === 1 ? 'bg-gray-400/20 text-gray-300'
                : idx === 2 ? 'bg-orange-500/20 text-orange-400'
                : 'bg-el text-muted'
              }`}>{idx + 1}</span>
              <div className="min-w-0">
                <p className="text-heading text-sm font-semibold truncate group-hover:text-primary transition-colors">
                  {ind.name}
                </p>
                <p className="text-muted text-[10px]">{ind.count} cổ phiếu</p>
              </div>
            </div>

            {/* 4 Rating cells */}
            {ratings.map(r => {
              const val = ind[r.key];
              const c = ratingColor(val);
              return (
                <div key={r.key} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full max-w-[64px] h-10 rounded-lg flex flex-col items-center justify-center border transition-all group-hover:scale-105"
                    style={{ background: c.bg, borderColor: c.ring }}
                  >
                    <span className="text-sm font-black" style={{ color: c.text }}>{val}</span>
                  </div>
                  <span className="text-[9px] font-bold" style={{ color: c.text }}>{letterGrade(val)}</span>
                </div>
              );
            })}

            {/* CR Score */}
            <div className="flex justify-center">
              <span className={`inline-flex items-center justify-center w-14 h-10 rounded-lg border text-sm font-black ${crBadgeColor(ind.cr)}`}>
                {ind.cr}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer gradient bar — overall market strength */}
      <div className="px-6 py-4 border-t border-line bg-sidebar/50">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted">Sức mạnh thị trường tổng thể</span>
          <span className="text-heading font-bold">
            {(industries.reduce((s, i) => s + i.overall, 0) / industries.length).toFixed(1)}
          </span>
        </div>
        <div className="w-full h-2 bg-el rounded-full overflow-hidden flex">
          {industries.map(ind => {
            const c = ratingColor(ind.overall);
            return (
              <div
                key={ind.name}
                className="h-full transition-all"
                style={{
                  width: `${100 / industries.length}%`,
                  background: `linear-gradient(90deg, ${c.ring}, ${c.text})`,
                }}
                title={`${ind.name}: ${ind.overall.toFixed(0)}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
