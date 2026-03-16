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
function normalize(pe: number | null, pb: number | null, cr: number | null,
  de: number | null, dy: number | null, epsG: number | null) {
  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
  return [
    clamp(pe != null ? (1 - pe / 30) * 100 : 0),     // P/E thấp = tốt
    clamp(pb != null ? (1 - pb / 3) * 100 : 0),       // P/B thấp = tốt
    clamp(cr != null ? (cr / 4) * 100 : 0),            // CR cao = tốt
    clamp(de != null ? (1 - de / 2) * 100 : 0),        // D/E thấp = tốt
    clamp(dy != null ? (dy / 0.15) * 100 : 0),         // DY cao = tốt
    clamp(epsG != null ? (epsG / 50) * 100 : 0),       // EPS Growth cao = tốt
  ];
}

export default function GrahamRadar({ pe, pb, currentRatio, deRatio, dividendYield, epsGrowth }: Props) {
  const stockScores = normalize(pe, pb, currentRatio, deRatio, dividendYield, epsGrowth);
  const grahamStd = normalize(15, 1.5, 2, 1, 0.05, 10);

  const labels = ['P/E thấp', 'P/B thấp', 'Thanh toán', 'Nợ thấp', 'Cổ tức', 'EPS Growth'];

  const options: ApexOptions = {
    chart: {
      type: 'radar',
      background: 'transparent',
      toolbar: { show: false },
      dropShadow: { enabled: false },
    },
    theme: { mode: 'dark' },
    colors: ['#64748b', '#818cf8'],
    stroke: { width: 2 },
    fill: { opacity: [0.1, 0.3] },
    markers: { size: [0, 4], hover: { size: 6 } },
    xaxis: {
      categories: labels,
      labels: {
        style: { colors: labels.map(() => '#94a3b8'), fontSize: '11px' },
      },
    },
    yaxis: { show: false, min: 0, max: 100, tickAmount: 5 },
    legend: {
      show: true,
      position: 'bottom',
      labels: { colors: '#e2e8f0' },
      fontSize: '12px',
    },
    tooltip: {
      theme: 'dark',
      y: { formatter: (v: number) => v + '/100' },
    },
  };

  const series = [
    { name: 'Chuẩn Graham', data: grahamStd },
    { name: 'Cổ phiếu hiện tại', data: stockScores },
  ];

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-primary">radar</span>
        <h4 className="text-heading font-bold">Điểm Graham (Radar)</h4>
      </div>
      <p className="text-muted text-xs mb-3">Vùng tím bứt ra khỏi vùng xám = vượt chuẩn Graham</p>
      <Chart options={options} series={series} type="radar" height={340} />
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
