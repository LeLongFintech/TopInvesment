import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface PeerItem {
  symbol: string;
  pe: number;
}

interface Props {
  data: PeerItem[];
  currentSymbol: string;
  currentPe: number | null;
  industry: string | null;
}

export default function GrahamPeHistogram({ data, currentSymbol, currentPe, industry }: Props) {
  if (data.length < 3 || currentPe == null) return null;

  const { bins, counts, arrowBin, percentile } = useMemo(() => {
    const peValues = data.map(d => d.pe).sort((a, b) => a - b);
    const min = Math.floor(peValues[0]);
    const max = Math.ceil(peValues[peValues.length - 1]);
    const binSize = Math.max(1, Math.ceil((max - min) / 12));
    const bins: string[] = [];
    const counts: number[] = [];

    let arrowBin = 0;
    for (let start = min; start < max; start += binSize) {
      const end = start + binSize;
      bins.push(`${start}-${end}`);
      const count = peValues.filter(v => v >= start && v < end).length;
      counts.push(count);
      if (currentPe >= start && currentPe < end) {
        arrowBin = bins.length - 1;
      }
    }

    // Percentile: what % of peers have higher P/E
    const below = peValues.filter(v => v <= currentPe).length;
    const percentile = Math.round((below / peValues.length) * 100);

    return { bins, counts, arrowBin, percentile };
  }, [data, currentPe]);

  const barColors = counts.map((_, i) => (i === arrowBin ? '#6366f1' : '#334155'));

  const options: ApexOptions = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
    theme: { mode: 'dark' },
    colors: barColors,
    plotOptions: {
      bar: { borderRadius: 3, columnWidth: '80%', distributed: true },
    },
    xaxis: {
      categories: bins,
      title: { text: 'P/E Range', style: { color: '#94a3b8' } },
      labels: { style: { colors: '#94a3b8', fontSize: '10px' }, rotate: -45, maxHeight: 60 },
    },
    yaxis: {
      title: { text: 'Số doanh nghiệp', style: { color: '#94a3b8' } },
      labels: { style: { colors: '#94a3b8' } },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: { borderColor: '#334155', strokeDashArray: 4 },
    tooltip: {
      theme: 'dark',
      custom: ({ dataPointIndex }: any) => {
        const isTarget = dataPointIndex === arrowBin;
        return `<div class="px-3 py-2 text-xs">
          <b>P/E: ${bins[dataPointIndex]}</b><br/>
          ${counts[dataPointIndex]} DN
          ${isTarget ? `<br/><b style="color:#6366f1">← ${currentSymbol} (${currentPe?.toFixed(1)})</b>` : ''}
        </div>`;
      },
    },
    annotations: {
      points: [
        {
          x: bins[arrowBin],
          y: counts[arrowBin],
          seriesIndex: 0,
          marker: { size: 0 },
          label: {
            text: `▼ ${currentSymbol} (P/E: ${currentPe.toFixed(1)})`,
            borderColor: '#6366f1',
            offsetY: -12,
            style: {
              background: '#6366f120',
              color: '#a5b4fc',
              fontSize: '11px',
              fontWeight: '700',
              padding: { left: 8, right: 8, top: 4, bottom: 4 },
            },
          },
        },
      ],
    },
  };

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">leaderboard</span>
        <h4 className="text-heading font-bold">Vị thế P/E trong ngành</h4>
        <span className="ml-auto text-xs text-muted">
          {industry || 'N/A'} • {data.length} DN
        </span>
      </div>
      <Chart options={options} series={[{ name: 'Count', data: counts }]} type="bar" height={280} />
      <div className="flex items-center justify-center gap-4 mt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-primary" />
          <span className="text-muted">{currentSymbol}</span>
        </div>
        <span className="text-heading font-bold">
          Percentile: <span className={`${percentile <= 30 ? 'text-green-400' : percentile <= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
            {percentile}%
          </span>
        </span>
        <span className="text-muted">
          {percentile <= 30 ? '— Rẻ hơn 70% ngành 🎯' : percentile <= 60 ? '— Trung bình' : '— Đắt hơn phần lớn ngành'}
        </span>
      </div>
    </div>
  );
}
