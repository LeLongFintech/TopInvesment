import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface StockItem {
  symbol: string;
  avg_dividend_yield: number;
  avg_coverage_ratio: number;
  consecutive_dividend_years: number;
}

interface Props {
  data: StockItem[];
}

export default function DividendScatter({ data }: Props) {
  if (data.length < 2) return null;

  // Group into 3 zones for coloring
  const seriesData = data.map(d => ({
    x: +(d.avg_dividend_yield * 100).toFixed(2),
    y: +d.avg_coverage_ratio.toFixed(2),
    z: d.consecutive_dividend_years,
    name: d.symbol,
  }));

  const options: ApexOptions = {
    chart: {
      type: 'bubble',
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: true },
    },
    theme: { mode: 'dark' },
    colors: ['#6366f1'],
    fill: { opacity: 0.6 },
    stroke: { width: 1, colors: ['#818cf8'] },
    xaxis: {
      title: { text: 'Tỷ suất cổ tức TB (%)', style: { color: '#94a3b8', fontWeight: '600' } },
      labels: { style: { colors: '#94a3b8' }, formatter: (v: string) => parseFloat(v).toFixed(1) + '%' },
      tickAmount: 8,
    },
    yaxis: {
      title: { text: 'DCR (Hệ số bao phủ)', style: { color: '#94a3b8', fontWeight: '600' } },
      labels: { style: { colors: '#94a3b8' }, formatter: (v: number) => v.toFixed(1) + 'x' },
    },
    plotOptions: {
      bubble: { minBubbleRadius: 6, maxBubbleRadius: 28 },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'middle',
      formatter: (_: number, opt: any) => {
        const point = seriesData[opt.dataPointIndex];
        return point?.name?.replace('.BK', '') || '';
      },
      style: { fontSize: '9px', fontWeight: '700', colors: ['#e2e8f0'] },
    },
    grid: { borderColor: '#334155', strokeDashArray: 4 },
    tooltip: {
      theme: 'dark',
      custom: ({ dataPointIndex }: any) => {
        const p = seriesData[dataPointIndex];
        if (!p) return '';
        return `<div class="px-3 py-2 text-xs">
          <b>${p.name}</b><br/>
          Yield: <b>${p.x.toFixed(2)}%</b><br/>
          DCR: <b>${p.y.toFixed(2)}x</b><br/>
          Liên tục: <b>${p.z} năm</b>
        </div>`;
      },
    },
    annotations: {
      yaxis: [
        {
          y: 1.5,
          borderColor: '#ef4444',
          strokeDashArray: 4,
          borderWidth: 2,
          label: {
            text: 'DCR = 1.5x (Ngưỡng an toàn)',
            borderColor: '#ef4444',
            style: { background: '#ef444420', color: '#f87171', fontSize: '10px', fontWeight: '700' },
            position: 'front',
          },
        },
      ],
    },
  };

  return (
    <div className="bg-surface-alt border border-line rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-line bg-sidebar flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-xl">bubble_chart</span>
        </div>
        <div>
          <h3 className="text-heading font-bold text-lg">Săn "Bò sữa" — Yield vs DCR</h3>
          <p className="text-muted text-xs mt-0.5">Góc Phải-Trên = An toàn & Sinh lời cao • Kích thước = Số năm trả liên tục</p>
        </div>
      </div>
      <div className="p-5">
        <Chart options={options} series={[{ name: 'Cổ phiếu', data: seriesData }]} type="bubble" height={420} />
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500" />
            <span>Góc phải-trên: Bò sữa 🐄</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500" />
            <span>Góc phải-dưới: Bẫy cổ tức ⚠️</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="mx-1">→</span>
            <span className="w-5 h-5 rounded-full bg-primary/40" />
            <span>Bong bóng lớn = Nhiều năm liên tục</span>
          </div>
        </div>
      </div>
    </div>
  );
}
