import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface DailyPoint {
  date: string;
  close_price: number;
  rs_score: number | null;
}

interface Props {
  data: DailyPoint[];
  symbol: string;
}

export default function RsLineChart({ data, symbol }: Props) {
  const filtered = data.filter(d => d.rs_score !== null);
  if (filtered.length < 10) return null;

  const { dates, prices, rsScores, blueDots } = useMemo(() => {
    const dates = filtered.map(d => d.date);
    const prices = filtered.map(d => d.close_price);
    const rsScores = filtered.map(d => d.rs_score!);

    // Detect Blue Dots: RS making new high before price
    // RS new 63-day high but price NOT at 63-day high
    const blueDots: { x: string; y: number }[] = [];
    for (let i = 63; i < filtered.length; i++) {
      const rsWindow = rsScores.slice(i - 63, i);
      const priceWindow = prices.slice(i - 63, i);
      const rsMax = Math.max(...rsWindow);
      const priceMax = Math.max(...priceWindow);

      if (rsScores[i] > rsMax && prices[i] < priceMax) {
        blueDots.push({ x: dates[i], y: rsScores[i] });
      }
    }

    return { dates, prices, rsScores, blueDots };
  }, [filtered]);

  const options: ApexOptions = {
    chart: { type: 'line', background: 'transparent', toolbar: { show: false } },
    theme: { mode: 'dark' },
    colors: ['#e2e8f0', '#3b82f6'],
    stroke: { width: [2, 2.5], curve: 'smooth' },
    xaxis: {
      categories: dates,
      labels: { show: true, rotate: -45, style: { fontSize: '9px', colors: '#94a3b8' }, maxHeight: 60 },
      tickAmount: 12,
    },
    yaxis: [
      { title: { text: 'Price', style: { color: '#94a3b8' } }, labels: { style: { colors: '#94a3b8' } } },
      { opposite: true, title: { text: 'RS Score', style: { color: '#94a3b8' } }, labels: { style: { colors: '#94a3b8' } } },
    ],
    annotations: {
      points: blueDots.map(dot => ({
        x: dot.x,
        y: dot.y,
        seriesIndex: 1,
        marker: { size: 6, fillColor: '#3b82f6', strokeColor: '#fff', strokeWidth: 2 },
        label: {
          text: '●',
          borderWidth: 0,
          style: { background: 'transparent', color: '#3b82f6', fontSize: '1px' },
        },
      })),
    },
    tooltip: { theme: 'dark' },
    legend: { labels: { colors: '#e2e8f0' } },
    grid: { borderColor: '#334155', strokeDashArray: 4 },
  };

  const series = [
    { name: 'Price', data: prices },
    { name: 'RS Score', data: rsScores },
  ];

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">insights</span>
        <h4 className="text-heading font-bold">RS Line & Blue Dots ({symbol})</h4>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          <span className="text-muted">{blueDots.length} Blue Dots (RS đỉnh trước giá)</span>
        </div>
      </div>
      <Chart options={options} series={series} type="line" height={320} />
    </div>
  );
}
