import React, { useMemo } from 'react';

interface StockItem {
  symbol: string;
  gics_industry: string | null;
  avg_dividend_yield: number;
  avg_coverage_ratio: number;
  consecutive_dividend_years: number;
}

interface Props {
  data: StockItem[];
}

function yieldColor(dy: number) {
  if (dy >= 0.08) return { bg: '#22c55e', text: '#bbf7d0' };
  if (dy >= 0.06) return { bg: '#4ade80', text: '#dcfce7' };
  if (dy >= 0.04) return { bg: '#facc15', text: '#fef9c3' };
  if (dy >= 0.02) return { bg: '#f97316', text: '#fed7aa' };
  return { bg: '#64748b', text: '#e2e8f0' };
}

export default function DividendSectorHeatmap({ data }: Props) {
  const sectors = useMemo(() => {
    const map = new Map<string, { count: number; totalYield: number; totalDcr: number; totalYears: number }>();
    data.forEach(item => {
      const ind = item.gics_industry || 'Chưa phân loại';
      const prev = map.get(ind) || { count: 0, totalYield: 0, totalDcr: 0, totalYears: 0 };
      map.set(ind, {
        count: prev.count + 1,
        totalYield: prev.totalYield + item.avg_dividend_yield,
        totalDcr: prev.totalDcr + item.avg_coverage_ratio,
        totalYears: prev.totalYears + item.consecutive_dividend_years,
      });
    });

    return Array.from(map.entries())
      .map(([name, d]) => ({
        name,
        count: d.count,
        avgYield: d.totalYield / d.count,
        avgDcr: d.totalDcr / d.count,
        avgYears: Math.round(d.totalYears / d.count),
      }))
      .sort((a, b) => b.avgYield - a.avgYield);
  }, [data]);

  if (!sectors.length) return null;

  const maxCount = Math.max(...sectors.map(s => s.count));

  return (
    <div className="bg-surface-alt border border-line rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-line bg-sidebar flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-xl">grid_view</span>
        </div>
        <div>
          <h3 className="text-heading font-bold text-lg">Dòng tiền Cổ tức theo Ngành</h3>
          <p className="text-muted text-xs mt-0.5">Màu đậm = Tỷ suất cổ tức TB cao • Ô lớn = Nhiều CP đạt tiêu chí</p>
        </div>
        {/* Legend */}
        <div className="ml-auto hidden md:flex items-center gap-3 text-xs">
          {[
            { label: '≥8%', color: '#22c55e' },
            { label: '6-8%', color: '#4ade80' },
            { label: '4-6%', color: '#facc15' },
            { label: '2-4%', color: '#f97316' },
            { label: '<2%', color: '#64748b' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
              <span className="text-muted">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="p-5">
        <div className="grid gap-3" style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(180px, 1fr))`,
        }}>
          {sectors.map((sector, idx) => {
            const c = yieldColor(sector.avgYield);
            const sizeFactor = 0.7 + 0.3 * (sector.count / maxCount);

            return (
              <div
                key={sector.name}
                className="relative rounded-xl border border-white/10 p-4 transition-all hover:scale-[1.02] hover:shadow-lg cursor-default"
                style={{
                  background: `linear-gradient(135deg, ${c.bg}15, ${c.bg}30)`,
                  borderColor: `${c.bg}40`,
                  minHeight: `${Math.round(100 * sizeFactor)}px`,
                }}
              >
                {/* Rank badge */}
                {idx < 3 && (
                  <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                    idx === 0 ? 'bg-yellow-500 text-black'
                    : idx === 1 ? 'bg-gray-400 text-black'
                    : 'bg-orange-500 text-black'
                  }`}>
                    {idx + 1}
                  </span>
                )}

                <h4 className="text-heading font-bold text-sm truncate mb-2" title={sector.name}>
                  {sector.name}
                </h4>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted">Yield TB</span>
                    <span className="text-sm font-black" style={{ color: c.bg }}>
                      {(sector.avgYield * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted">DCR TB</span>
                    <span className={`text-xs font-bold ${sector.avgDcr >= 1.5 ? 'text-green-400' : 'text-red-400'}`}>
                      {sector.avgDcr.toFixed(1)}x
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted">CP đạt</span>
                    <span className="text-xs font-bold text-heading">{sector.count}</span>
                  </div>
                </div>

                {/* Bottom bar — avg years */}
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min(100, (sector.avgYears / 10) * 100)}%`, background: c.bg }}
                    />
                  </div>
                  <span className="text-[9px] text-muted">{sector.avgYears}y</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
