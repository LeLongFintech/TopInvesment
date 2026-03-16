import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface Props {
  roe: number | null; // Decimal, e.g. 0.23 = 23%
}

export default function RoeGauge({ roe }: Props) {
  if (roe === null || roe === undefined) return null;

  const pct = Math.min(Math.round(roe * 100), 100);
  const color = pct >= 17 ? '#22c55e' : pct >= 10 ? '#eab308' : '#ef4444';

  const options: ApexOptions = {
    chart: { type: 'radialBar', background: 'transparent' },
    theme: { mode: 'dark' },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { size: '60%' },
        track: { background: '#1e293b', strokeWidth: '100%' },
        dataLabels: {
          name: { show: true, offsetY: -10, color: '#94a3b8', fontSize: '14px' },
          value: {
            show: true,
            fontSize: '28px',
            fontWeight: '800',
            color,
            formatter: () => pct + '%',
          },
        },
      },
    },
    colors: [color],
    labels: ['ROE'],
    stroke: { lineCap: 'round' },
  };

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2 self-start">
        <span className="material-symbols-outlined text-primary">speed</span>
        <h4 className="text-heading font-bold">ROE Gauge (A)</h4>
      </div>
      <Chart options={options} series={[pct]} type="radialBar" height={250} width={250} />
      <div className="flex items-center gap-2 text-xs mt-1">
        <span className="text-muted">Target:</span>
        <span className={`font-bold ${pct >= 17 ? 'text-green-400' : 'text-yellow-400'}`}>≥ 17%</span>
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${pct >= 17 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {pct >= 17 ? 'PASS' : 'FAIL'}
        </span>
      </div>
    </div>
  );
}
