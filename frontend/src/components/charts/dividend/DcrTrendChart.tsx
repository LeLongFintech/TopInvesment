import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface YearlyPoint {
  year: number;
  dcr: number | null;
}

interface Props {
  data: YearlyPoint[];
  symbol: string;
}

export default function DcrTrendChart({ data, symbol }: Props) {
  const filtered = data.filter(d => d.dcr != null);
  if (filtered.length < 2) return null;

  const categories = filtered.map(d => String(d.year));
  const dcrValues = filtered.map(d => d.dcr!);
  const allAbove = dcrValues.every(v => v >= 1.5);
  const isDeclining = dcrValues.length >= 3 &&
    dcrValues.slice(-3).every((v, i, a) => i === 0 || v <= a[i - 1]);

  // Color bars: green above 1.5, red below
  const barColors = dcrValues.map(v => (v >= 1.5 ? '#22c55e' : '#ef4444'));

  const options: ApexOptions = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
    theme: { mode: 'dark' },
    colors: barColors,
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: '55%', distributed: true },
    },
    xaxis: {
      categories,
      labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
    },
    yaxis: {
      title: { text: 'Dividend Coverage Ratio', style: { color: '#94a3b8' } },
      labels: { style: { colors: '#94a3b8' }, formatter: (v: number) => v.toFixed(1) + 'x' },
    },
    dataLabels: {
      enabled: true,
      formatter: (v: number) => v.toFixed(2) + 'x',
      offsetY: -18,
      style: { fontSize: '10px', fontWeight: '700', colors: ['#e2e8f0'] },
    },
    annotations: {
      yaxis: [
        {
          y: 1.5,
          borderColor: '#ef4444',
          strokeDashArray: 0,
          borderWidth: 2,
          label: {
            text: 'Benchmark 1.5x',
            borderColor: '#ef4444',
            style: {
              background: '#ef444420',
              color: '#f87171',
              fontSize: '11px',
              fontWeight: '700',
              padding: { left: 8, right: 8, top: 4, bottom: 4 },
            },
            position: 'front',
          },
        },
      ],
    },
    legend: { show: false },
    grid: { borderColor: '#334155', strokeDashArray: 4 },
    tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toFixed(3) + 'x' } },
  };

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">health_metrics</span>
        <h4 className="text-heading font-bold">Xu hướng DCR — {symbol}</h4>
        <div className="ml-auto flex items-center gap-2">
          {isDeclining && allAbove && (
            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-400">
              ⚠ DCR đang giảm dần
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            allAbove
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {allAbove ? '✓ Luôn trên 1.5x' : '✗ Có năm dưới 1.5x'}
          </span>
        </div>
      </div>
      <p className="text-muted text-xs mb-3">
        DCR &gt; 1.5x = an toàn. Cột xanh nằm trên đường đỏ qua nhiều năm → khả năng chi trả bền vững.
      </p>
      <Chart options={options} series={[{ name: 'DCR', data: dcrValues }]} type="bar" height={380} />
    </div>
  );
}
