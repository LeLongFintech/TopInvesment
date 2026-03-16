import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface StockItem {
  symbol: string;
  gics_industry: string | null;
  rs_rating: number;
  eps_rating: number;
  smr_rating: number;
  ad_rating: number;
  cr_score: number;
}

interface Props {
  items: StockItem[];
}

export default function IndustryHeatmap({ items }: Props) {
  const heatmapData = useMemo(() => {
    // Group by industry
    const map = new Map<string, { rs: number[]; eps: number[]; smr: number[]; ad: number[] }>();
    items.forEach(item => {
      const ind = item.gics_industry || 'N/A';
      if (!map.has(ind)) map.set(ind, { rs: [], eps: [], smr: [], ad: [] });
      const g = map.get(ind)!;
      g.rs.push(item.rs_rating);
      g.eps.push(item.eps_rating);
      g.smr.push(item.smr_rating);
      g.ad.push(item.ad_rating);
    });

    const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

    const industries = Array.from(map.entries())
      .map(([name, d]) => ({
        name: name.length > 25 ? name.slice(0, 22) + '...' : name,
        rs: avg(d.rs),
        eps: avg(d.eps),
        smr: avg(d.smr),
        ad: avg(d.ad),
      }))
      .sort((a, b) => (b.rs + b.eps + b.smr + b.ad) - (a.rs + a.eps + a.smr + a.ad))
      .slice(0, 12);

    // ApexCharts heatmap format: series = [{name: rating, data: [{x: industry, y: value}]}]
    const ratings = ['RS', 'EPS', 'SMR', 'A/D'];
    const keys = ['rs', 'eps', 'smr', 'ad'] as const;
    return ratings.map((rating, idx) => ({
      name: rating,
      data: industries.map(ind => ({ x: ind.name, y: ind[keys[idx]] })),
    }));
  }, [items]);

  if (!heatmapData[0]?.data.length) return null;

  const options: ApexOptions = {
    chart: { type: 'heatmap', background: 'transparent', toolbar: { show: false } },
    theme: { mode: 'dark' },
    dataLabels: { enabled: true, style: { fontSize: '11px', fontWeight: '700' } },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.7,
        radius: 4,
        colorScale: {
          ranges: [
            { from: 0, to: 49, color: '#ef4444', name: '< 50' },
            { from: 50, to: 69, color: '#eab308', name: '50-69' },
            { from: 70, to: 89, color: '#22c55e', name: '70-89' },
            { from: 90, to: 99, color: '#3b82f6', name: '≥ 90 (Blue Chip)' },
          ],
        },
      },
    },
    xaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' }, rotate: -45, maxHeight: 80 } },
    yaxis: { labels: { style: { colors: '#94a3b8' } } },
    tooltip: { theme: 'dark' },
    legend: { labels: { colors: '#e2e8f0' } },
  };

  return (
    <div className="bg-card rounded-xl border border-line/30 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">grid_view</span>
        <h4 className="text-heading font-bold">Bản đồ nhiệt theo Ngành (L)</h4>
        <span className="ml-auto text-xs text-muted">Top {heatmapData[0]?.data.length} ngành</span>
      </div>
      <Chart options={options} series={heatmapData} type="heatmap" height={260} />
    </div>
  );
}
