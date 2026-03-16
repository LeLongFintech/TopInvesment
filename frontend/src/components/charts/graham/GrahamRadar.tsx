import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface Props {
  pe: number | null;
  pb: number | null;
  currentRatio: number | null;
  deRatio: number | null;
  dividendYield: number | null;
  epsGrowth: number | null;
}

/**
 * Normalize real values to 0-100 radar scale where 100 = best Graham score.
 * Lower P/E, lower P/B, lower D/E are BETTER (inverted).
 * Higher CR, higher Div Yield, higher EPS growth are better (direct).
 */
function normalizeGraham(pe: number | null, pb: number | null, cr: number | null,
  de: number | null, dy: number | null, epsG: number | null) {
  return {
    pe: pe != null ? Math.max(0, Math.min(100, (1 - pe / 30) * 100)) : 0,
    pb: pb != null ? Math.max(0, Math.min(100, (1 - pb / 3) * 100)) : 0,
    cr: cr != null ? Math.max(0, Math.min(100, (cr / 4) * 100)) : 0,
    de: de != null ? Math.max(0, Math.min(100, (1 - de / 2) * 100)) : 0,
    dy: dy != null ? Math.max(0, Math.min(100, (dy / 0.15) * 100)) : 0,
    epsG: epsG != null ? Math.max(0, Math.min(100, (epsG / 50) * 100)) : 0,
  };
}

export default function GrahamRadar({ pe, pb, currentRatio, deRatio, dividendYield, epsGrowth }: Props) {
  const scores = normalizeGraham(pe, pb, currentRatio, deRatio, dividendYield, epsGrowth);

  // Graham standard zone (P/E<=15 → 50%, P/B<=1.5 → 50%, CR>=2 → 50%, D/E<=1 → 50%, DY>=5% → 33%, EPS>0)
  const grahamStd = normalizeGraham(15, 1.5, 2, 1, 0.05, 10);

  const options: ApexOptions = {
    chart: { type: 'radar', background: 'transparent', toolbar: { show: false } },
    theme: { mode: 'dark' },
    colors: ['rgba(100,116,139,0.35)', '#6366f1'],
    stroke: { width: [2, 2.5] },
    fill: { opacity: [0.1, 0.25] },
    markers: { size: [0, 4], colors: ['transparent', '#6366f1'], strokeColors: '#fff', strokeWidth: 1 },
    xaxis: {
      categories: ['P/E thấp', 'P/B thấp', 'Thanh toán (CR)', 'Nợ thấp (D/E)', 'Cổ tức (DY)', 'EPS Growth'],
      labels: { style: { colors: Array(6).fill('#94a3b8'), fontSize: '11px' } },
    },
    yaxis: { show: false, max: 100 },
    plotOptions: { radar: { polygons: { strokeColors: '#334155', connectorColors: '#334155', fill: { colors: ['transparent'] } } } },
    legend: { labels: { colors: '#e2e8f0' }, position: 'bottom', fontSize: '12px' },
    tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toFixed(0) + '/100' } },
  };

  const series = [
    {
      name: 'Chuẩn Graham',
      data: [grahamStd.pe, grahamStd.pb, grahamStd.cr, grahamStd.de, grahamStd.dy, grahamStd.epsG],
    },
    {
      name: 'Cổ phiếu hiện tại',
      data: [scores.pe, scores.pb, scores.cr, scores.de, scores.dy, scores.epsG],
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-primary">radar</span>
        <h4 className="text-heading font-bold">Điểm Graham (Radar)</h4>
      </div>
      <p className="text-muted text-xs mb-3">Vùng tím bứt ra khỏi vùng xám = vượt chuẩn Graham</p>
      <Chart options={options} series={series} type="radar" height={320} />
      <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
        {[
          { label: 'P/E', val: pe?.toFixed(1), good: pe != null && pe <= 15 },
          { label: 'P/B', val: pb?.toFixed(1), good: pb != null && pb <= 1.5 },
          { label: 'CR', val: currentRatio?.toFixed(2), good: currentRatio != null && currentRatio >= 2 },
          { label: 'D/E', val: deRatio?.toFixed(2), good: deRatio != null && deRatio <= 1 },
          { label: 'DY', val: dividendYield != null ? (dividendYield * 100).toFixed(1) + '%' : '—', good: dividendYield != null && dividendYield >= 0.05 },
          { label: 'EPS▲', val: epsGrowth != null ? epsGrowth.toFixed(1) + '%' : '—', good: epsGrowth != null && epsGrowth > 0 },
        ].map(m => (
          <div key={m.label} className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${m.good ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-muted">{m.label}:</span>
            <span className={`font-bold ${m.good ? 'text-green-400' : 'text-red-400'}`}>{m.val ?? '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
