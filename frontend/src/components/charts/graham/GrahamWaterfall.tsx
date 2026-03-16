import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface Props {
  grahamNumber: number | null;
  closePrice: number | null;
  marginOfSafety: number | null;
  symbol: string;
}

export default function GrahamWaterfall({ grahamNumber, closePrice, marginOfSafety, symbol }: Props) {
  if (!grahamNumber || !closePrice) return null;

  const discount = grahamNumber - closePrice;
  const mosPct = marginOfSafety != null ? (marginOfSafety * 100).toFixed(1) : '—';
  const isSafe = discount > 0;

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: { show: false },
    },
    theme: { mode: 'dark' },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '55%',
        distributed: true,
        dataLabels: { position: 'top' },
      },
    },
    colors: ['#6366f1', isSafe ? '#22c55e' : '#ef4444', '#f59e0b'],
    xaxis: {
      categories: ['Giá trị nội tại', isSafe ? 'Biên an toàn' : 'Bù giá', 'Giá thị trường'],
      labels: { style: { colors: '#94a3b8', fontSize: '12px', fontWeight: '600' } },
    },
    yaxis: {
      labels: { style: { colors: '#94a3b8' }, formatter: (v: number) => v.toFixed(0) },
      title: { text: 'Giá (THB)', style: { color: '#94a3b8' } },
    },
    dataLabels: {
      enabled: true,
      formatter: (v: number) => v.toFixed(1),
      offsetY: -22,
      style: { fontSize: '13px', fontWeight: '800', colors: ['#e2e8f0'] },
    },
    legend: { show: false },
    grid: { borderColor: '#334155', strokeDashArray: 4 },
    tooltip: { theme: 'dark' },
    annotations: {
      yaxis: isSafe
        ? [
            {
              y: closePrice,
              y2: grahamNumber,
              fillColor: '#22c55e',
              opacity: 0.08,
              label: {
                text: `MoS: ${mosPct}%`,
                borderColor: '#22c55e',
                style: { background: '#22c55e20', color: '#22c55e', fontSize: '12px', fontWeight: '700' },
                position: 'front',
              },
            },
          ]
        : [],
    },
  };

  const series = [
    {
      name: 'Value',
      data: [grahamNumber, Math.abs(discount), closePrice],
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">waterfall_chart</span>
        <h4 className="text-heading font-bold">Biên an toàn — {symbol}</h4>
        <div className="ml-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${isSafe ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {isSafe ? `✓ MoS ${mosPct}%` : `✗ Overvalued ${mosPct}%`}
          </span>
        </div>
      </div>
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
}
