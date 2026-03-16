import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface YearlyPoint {
  year: number;
  dps: number | null;
  dividend_yield: number | null;
}

interface Props {
  data: YearlyPoint[];
  symbol: string;
}

export default function DividendYieldCombo({ data, symbol }: Props) {
  if (!data.length) return null;

  const categories = data.map(d => String(d.year));
  const dpsValues = data.map(d => d.dps ?? 0);
  const yieldValues = data.map(d => (d.dividend_yield != null ? +(d.dividend_yield * 100).toFixed(2) : null));

  // Trend check: is DPS consistently increasing?
  const isGrowing = dpsValues.length >= 3 &&
    dpsValues.slice(-3).every((v, i, a) => i === 0 || v >= a[i - 1]);

  const options: ApexOptions = {
    chart: { type: 'line', background: 'transparent', toolbar: { show: false } },
    theme: { mode: 'dark' },
    colors: ['#6366f1', '#f59e0b'],
    stroke: { width: [0, 3], curve: 'smooth' },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
    xaxis: {
      categories,
      labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
    },
    yaxis: [
      {
        title: { text: 'Cổ tức / CP (THB)', style: { color: '#94a3b8' } },
        labels: { style: { colors: '#94a3b8' }, formatter: (v: number) => v.toFixed(2) },
      },
      {
        opposite: true,
        title: { text: 'Tỷ suất cổ tức (%)', style: { color: '#94a3b8' } },
        labels: { style: { colors: '#94a3b8' }, formatter: (v: number) => v.toFixed(1) + '%' },
      },
    ],
    tooltip: { theme: 'dark' },
    legend: { labels: { colors: '#e2e8f0' }, position: 'bottom' },
    grid: { borderColor: '#334155', strokeDashArray: 4 },
  };

  const series = [
    { name: 'DPS (tiền mặt)', type: 'column' as const, data: dpsValues },
    { name: 'Dividend Yield', type: 'line' as const, data: yieldValues },
  ];

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">payments</span>
        <h4 className="text-heading font-bold">Cổ tức & Tỷ suất — {symbol}</h4>
        <div className="ml-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isGrowing
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {isGrowing ? '✓ DPS tăng trưởng' : '⚠ DPS không ổn định'}
          </span>
        </div>
      </div>
      <p className="text-muted text-xs mb-3">
        Cột = tiền mặt thực chi | Đường = tỷ suất cổ tức. Cả hai cùng đi lên → tín hiệu an toàn.
      </p>
      <Chart options={options} series={series} type="line" height={380} />
    </div>
  );
}
