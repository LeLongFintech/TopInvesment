import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface Props {
  currentRatio: number | null;
  deRatio: number | null;
}

export default function GrahamBullet({ currentRatio, deRatio }: Props) {
  if (currentRatio == null && deRatio == null) return null;

  const metrics = [
    {
      label: 'Current Ratio',
      value: currentRatio ?? 0,
      target: 2.0,
      max: 5.0,
      desc: 'Mục tiêu ≥ 2.0',
      good: currentRatio != null && currentRatio >= 2.0,
      ranges: [1.0, 2.0, 5.0], // Poor / Fair / Good
      rangeColors: ['#ef4444', '#eab308', '#22c55e'],
    },
    {
      label: 'Debt / Equity',
      value: deRatio ?? 0,
      target: 1.0,
      max: 3.0,
      desc: 'Mục tiêu ≤ 1.0',
      good: deRatio != null && deRatio <= 1.0,
      ranges: [1.0, 2.0, 3.0], // Good / Fair / Poor (inverted)
      rangeColors: ['#22c55e', '#eab308', '#ef4444'],
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">vital_signs</span>
        <h4 className="text-heading font-bold">Sức khỏe Tài chính (Bullet)</h4>
      </div>
      <div className="space-y-6">
        {metrics.map(m => {
          const pct = Math.min((m.value / m.max) * 100, 100);
          const targetPct = (m.target / m.max) * 100;

          return (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-heading text-sm font-semibold">{m.label}</span>
                  <span className="text-muted text-xs ml-2">({m.desc})</span>
                </div>
                <span className={`text-lg font-black ${m.good ? 'text-green-400' : 'text-red-400'}`}>
                  {m.value.toFixed(2)}
                </span>
              </div>
              {/* Bullet bar */}
              <div className="relative h-7 rounded-md overflow-hidden bg-el">
                {/* Range zones */}
                {m.ranges.map((r, i) => {
                  const startPct = i === 0 ? 0 : (m.ranges[i - 1] / m.max) * 100;
                  const widthPct = (r / m.max) * 100 - startPct;
                  return (
                    <div
                      key={i}
                      className="absolute top-0 h-full opacity-20"
                      style={{ left: `${startPct}%`, width: `${widthPct}%`, background: m.rangeColors[i] }}
                    />
                  );
                })}
                {/* Value bar */}
                <div
                  className="absolute top-1.5 h-4 rounded-sm transition-all"
                  style={{
                    width: `${pct}%`,
                    background: m.good
                      ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                      : 'linear-gradient(90deg, #ef4444, #f87171)',
                  }}
                />
                {/* Target line */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-white/80 z-10"
                  style={{ left: `${targetPct}%` }}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white bg-black/60 px-1 rounded whitespace-nowrap">
                    {m.target}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-[9px] text-muted mt-0.5">
                <span>0</span>
                <span>{m.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
