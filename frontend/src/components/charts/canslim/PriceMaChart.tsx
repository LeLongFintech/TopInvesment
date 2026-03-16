import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface DailyPoint {
  date: string;
  close_price: number;
  high_price: number | null;
}

interface Props {
  data: DailyPoint[];
  symbol: string;
}

export default function PriceMaChart({ data, symbol }: Props) {
  if (data.length < 10) return null;

  const { dates, prices, ma50, ma200, high52 } = useMemo(() => {
    const dates = data.map(d => d.date);
    const prices = data.map(d => d.close_price);

    // MA50
    const ma50: (number | null)[] = prices.map((_, i) => {
      if (i < 49) return null;
      return prices.slice(i - 49, i + 1).reduce((a, b) => a + b, 0) / 50;
    });

    // MA200
    const ma200: (number | null)[] = prices.map((_, i) => {
      if (i < 199) return null;
      return prices.slice(i - 199, i + 1).reduce((a, b) => a + b, 0) / 200;
    });

    // 52-week high (252 trading days)
    const allHighs = data.map(d => d.high_price ?? d.close_price);
    const lookback = Math.min(252, allHighs.length);
    const high52 = Math.max(...allHighs.slice(-lookback));

    return { dates, prices, ma50, ma200, high52 };
  }, [data]);

  const lastPrice = prices[prices.length - 1];
  const pctFromHigh = ((lastPrice - high52) / high52 * 100).toFixed(1);

  const options: ApexOptions = {
    chart: { type: 'line', background: 'transparent', toolbar: { show: false }, zoom: { enabled: false } },
    theme: { mode: 'dark' },
    colors: ['#e2e8f0', '#f59e0b', '#6366f1'],
    stroke: { width: [2.5, 1.5, 1.5], curve: 'smooth', dashArray: [0, 0, 5] },
    xaxis: {
      categories: dates,
      labels: { show: true, rotate: -45, style: { fontSize: '9px', colors: '#94a3b8' }, maxHeight: 60 },
      tickAmount: 12,
    },
    yaxis: {
      title: { text: 'Price', style: { color: '#94a3b8' } },
      labels: { style: { colors: '#94a3b8' } },
    },
    annotations: {
      yaxis: [
        {
          y: high52,
          borderColor: '#22c55e',
          strokeDashArray: 3,
          label: { text: `52W High: ${high52.toFixed(1)}`, borderColor: '#22c55e', style: { background: '#22c55e20', color: '#22c55e', fontSize: '10px' }, position: 'front' },
        },
      ],
    },
    tooltip: { theme: 'dark' },
    legend: { labels: { colors: '#e2e8f0' } },
    grid: { borderColor: '#334155', strokeDashArray: 4 },
  };

  const series = [
    { name: 'Close', data: prices },
    { name: 'MA50', data: ma50 },
    { name: 'MA200', data: ma200 },
  ];

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">show_chart</span>
        <h4 className="text-heading font-bold">Price & MA ({symbol})</h4>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="text-muted">vs 52W High:</span>
          <span className={`font-bold ${parseFloat(pctFromHigh) >= -5 ? 'text-green-400' : 'text-yellow-400'}`}>
            {pctFromHigh}%
          </span>
        </div>
      </div>
      <Chart options={options} series={series} type="line" height={320} />
    </div>
  );
}
