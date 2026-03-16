import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface DailyPoint {
  date: string;
  close_price: number;
  volume: number | null;
}

interface Props {
  data: DailyPoint[];
}

export default function VolumeObv({ data }: Props) {
  if (data.length < 10) return null;

  const { dates, volumes, volColors, obv, ma50Vol } = useMemo(() => {
    const dates = data.map(d => d.date);
    const volumes = data.map(d => d.volume ?? 0);

    // Color volume bars: green if close > prev close, red otherwise
    const volColors = data.map((d, i) => (i === 0 ? '#64748b' : d.close_price >= data[i - 1].close_price ? '#22c55e' : '#ef4444'));

    // OBV calculation
    const obv: number[] = [0];
    for (let i = 1; i < data.length; i++) {
      const change = data[i].close_price - data[i - 1].close_price;
      const vol = data[i].volume ?? 0;
      obv.push(obv[i - 1] + (change > 0 ? vol : change < 0 ? -vol : 0));
    }

    // MA50 of volume
    const ma50Vol: (number | null)[] = volumes.map((_, i) => {
      if (i < 49) return null;
      const slice = volumes.slice(i - 49, i + 1);
      return slice.reduce((a, b) => a + b, 0) / 50;
    });

    return { dates, volumes, volColors, obv, ma50Vol };
  }, [data]);

  const options: ApexOptions = {
    chart: { type: 'line', background: 'transparent', toolbar: { show: false }, stacked: false },
    theme: { mode: 'dark' },
    colors: ['#64748b', '#6366f1', '#f59e0b'],
    stroke: { width: [0, 2, 2], curve: 'smooth' },
    plotOptions: { bar: { columnWidth: '80%' } },
    xaxis: {
      categories: dates,
      labels: { show: true, rotate: -45, style: { fontSize: '9px', colors: '#94a3b8' }, maxHeight: 60 },
      tickAmount: 12,
    },
    yaxis: [
      { title: { text: 'Volume', style: { color: '#94a3b8' } }, labels: { style: { colors: '#94a3b8' }, formatter: (v: number) => (v / 1e6).toFixed(1) + 'M' } },
      { opposite: true, title: { text: 'OBV', style: { color: '#94a3b8' } }, labels: { style: { colors: '#94a3b8' }, formatter: (v: number) => (v / 1e6).toFixed(1) + 'M' } },
    ],
    tooltip: { theme: 'dark', x: { format: 'yyyy-MM-dd' } },
    legend: { labels: { colors: '#e2e8f0' } },
    grid: { borderColor: '#334155', strokeDashArray: 4 },
  };

  const series = [
    { name: 'Volume', type: 'column' as const, data: volumes },
    { name: 'OBV', type: 'line' as const, data: obv },
    { name: 'MA50 Vol', type: 'line' as const, data: ma50Vol },
  ];

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">equalizer</span>
        <h4 className="text-heading font-bold">Khối lượng & OBV (S)</h4>
      </div>
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
}
