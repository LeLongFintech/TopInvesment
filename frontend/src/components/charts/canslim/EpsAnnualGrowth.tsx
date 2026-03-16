import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface Props {
  data: { year: number; eps_growth: number | null; revenue: number | null; net_income: number | null; roe: number | null }[];
}

export default function EpsAnnualGrowth({ data }: Props) {
  if (!data.length) return null;

  const categories = data.map(d => String(d.year));
  const epsGrowth = data.map(d => d.eps_growth ?? 0);
  const colors = epsGrowth.map(v => (v >= 0 ? '#22c55e' : '#ef4444'));

  const options: ApexOptions = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
    theme: { mode: 'dark' },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
        distributed: true,
        dataLabels: { position: 'top' },
      },
    },
    colors,
    xaxis: {
      categories,
      labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
    },
    yaxis: {
      title: { text: 'EPS Growth %', style: { color: '#94a3b8' } },
      labels: { style: { colors: '#94a3b8' }, formatter: (v: number) => v.toFixed(0) + '%' },
    },
    dataLabels: {
      enabled: true,
      formatter: (v: number) => (v !== null ? v.toFixed(1) + '%' : ''),
      offsetY: -20,
      style: { fontSize: '10px', colors: ['#e2e8f0'] },
    },
    tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toFixed(2) + '%' } },
    legend: { show: false },
    grid: { borderColor: '#334155', strokeDashArray: 4 },
    annotations: {
      yaxis: [
        { y: 0, borderColor: '#64748b', strokeDashArray: 0, borderWidth: 1 },
      ],
    },
  };

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">bar_chart</span>
        <h4 className="text-heading font-bold">Tăng trưởng EPS hàng năm (A)</h4>
      </div>
      <Chart options={options} series={[{ name: 'EPS Growth', data: epsGrowth }]} type="bar" height={280} />
    </div>
  );
}
