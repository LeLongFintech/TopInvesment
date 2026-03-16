import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface Props {
  data: { quarter: string; eps: number | null; revenue_growth: number | null }[];
}

export default function EpsQuarterlyCombo({ data }: Props) {
  if (!data.length) return null;

  const last20 = data.slice(-20);
  const categories = last20.map(d => d.quarter);
  const epsValues = last20.map(d => d.eps ?? 0);
  const revGrowth = last20.map(d => d.revenue_growth ?? null);

  // Detect EPS acceleration (current > previous > 0)
  const annotations: ApexOptions['annotations'] = {
    points: epsValues
      .map((v, i) => {
        if (i > 0 && v > epsValues[i - 1] && epsValues[i - 1] > 0) {
          return {
            x: categories[i],
            y: v,
            seriesIndex: 0,
            marker: { size: 0 },
            label: {
              text: '▲',
              borderWidth: 0,
              style: { background: 'transparent', color: '#f97316', fontSize: '14px', fontWeight: '900' },
              offsetY: -10,
            },
          };
        }
        return null;
      })
      .filter(Boolean) as any[],
  };

  const options: ApexOptions = {
    chart: { type: 'line', background: 'transparent', toolbar: { show: false } },
    theme: { mode: 'dark' },
    colors: ['#6366f1', '#10b981'],
    stroke: { width: [0, 3], curve: 'smooth' },
    plotOptions: { bar: { borderRadius: 3, columnWidth: '55%' } },
    xaxis: { categories, labels: { rotate: -45, style: { fontSize: '10px', colors: '#94a3b8' } } },
    yaxis: [
      { title: { text: 'EPS', style: { color: '#94a3b8' } }, labels: { style: { colors: '#94a3b8' } } },
      {
        opposite: true,
        title: { text: 'Revenue Growth %', style: { color: '#94a3b8' } },
        labels: { style: { colors: '#94a3b8' }, formatter: (v: number) => (v !== null ? v.toFixed(1) + '%' : '') },
      },
    ],
    annotations,
    tooltip: { theme: 'dark' },
    legend: { labels: { colors: '#e2e8f0' } },
    grid: { borderColor: '#334155', strokeDashArray: 4 },
  };

  const series = [
    { name: 'EPS Quý', type: 'column' as const, data: epsValues },
    { name: 'Tăng trưởng DT', type: 'line' as const, data: revGrowth },
  ];

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">trending_up</span>
        <h4 className="text-heading font-bold">Nhịp đập Lợi nhuận (C)</h4>
        <span className="text-xs text-muted ml-auto">▲ = EPS tăng tốc</span>
      </div>
      <Chart options={options} series={series} type="line" height={320} />
    </div>
  );
}
