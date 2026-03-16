import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface AnnualData {
  year: number;
  eps: number | null;
  dividend_per_share: number | null;
}

interface Props {
  data: AnnualData[];
  symbol: string;
}

export default function GrahamEpsHistory({ data, symbol }: Props) {
  if (!data.length) return null;

  const last10 = data.slice(-10);
  const categories = last10.map(d => String(d.year));
  const epsValues = last10.map(d => d.eps ?? 0);
  const divValues = last10.map(d => d.dividend_per_share ?? 0);
  const allPositive = epsValues.every(v => v > 0);

  // Color bars: green for positive EPS, red for negative
  const barColors = epsValues.map(v => (v >= 0 ? '#6366f1' : '#ef4444'));

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
        title: { text: 'EPS', style: { color: '#94a3b8' } },
        labels: { style: { colors: '#94a3b8' } },
      },
      {
        opposite: true,
        title: { text: 'Cổ tức / CP', style: { color: '#94a3b8' } },
        labels: { style: { colors: '#94a3b8' } },
      },
    ],
    tooltip: { theme: 'dark' },
    legend: { labels: { colors: '#e2e8f0' }, position: 'bottom' },
    grid: { borderColor: '#334155', strokeDashArray: 4 },
    annotations: {
      yaxis: [{ y: 0, borderColor: '#64748b', strokeDashArray: 0, borderWidth: 1 }],
    },
  };

  const series = [
    { name: 'EPS', type: 'column' as const, data: epsValues },
    { name: 'Cổ tức / CP', type: 'line' as const, data: divValues },
  ];

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">monitoring</span>
        <h4 className="text-heading font-bold">Lịch sử EPS & Cổ tức — {symbol}</h4>
        <div className="ml-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${allPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {allPositive ? `✓ ${last10.length} năm liên tục dương` : '✗ Có năm lỗ'}
          </span>
        </div>
      </div>
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
}
