import React from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine, Cell, Label
} from 'recharts';

interface ScatterPoint {
    symbol: string;
    pe: number;
    margin_of_safety: number;
}

interface Props {
    data: ScatterPoint[];
}

const COLORS = {
    excellent: '#22c55e',   // MoS >= 40%
    good: '#6366f1',        // MoS >= 30%
    fair: '#eab308',        // MoS >= 20%
    low: '#ef4444',         // MoS < 20%
};

function getColor(mos: number): string {
    if (mos >= 0.4) return COLORS.excellent;
    if (mos >= 0.3) return COLORS.good;
    if (mos >= 0.2) return COLORS.fair;
    return COLORS.low;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="bg-card border border-line rounded-lg px-3 py-2 shadow-xl text-xs">
            <p className="text-heading font-bold text-sm mb-1">{d.symbol}</p>
            <p className="text-muted">P/E: <span className="text-heading font-medium">{d.pe.toFixed(1)}</span></p>
            <p className="text-muted">MoS: <span className="text-heading font-medium">{(d.margin_of_safety * 100).toFixed(1)}%</span></p>
        </div>
    );
};

export default function ValuationScatter({ data }: Props) {
    if (!data.length) return null;

    const formatted = data.map(d => ({
        ...d,
        mos_pct: +(d.margin_of_safety * 100).toFixed(1),
    }));

    return (
        <div className="bg-surface-alt border border-line rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">scatter_plot</span>
                <h3 className="text-heading font-bold">P/E vs Biên an toàn</h3>
            </div>
            <p className="text-muted text-xs mb-4">
                Góc <strong>trên-trái</strong> = "Siêu cổ phiếu" (P/E thấp + Biên an toàn cao)
            </p>
            <ResponsiveContainer width="100%" height={350}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line, #333)" opacity={0.5} />
                    <XAxis
                        type="number"
                        dataKey="pe"
                        name="P/E"
                        tick={{ fill: 'var(--color-muted, #888)', fontSize: 11 }}
                        tickLine={false}
                    >
                        <Label value="P/E Ratio" position="bottom" offset={5} style={{ fill: 'var(--color-muted, #888)', fontSize: 11 }} />
                    </XAxis>
                    <YAxis
                        type="number"
                        dataKey="mos_pct"
                        name="MoS %"
                        tick={{ fill: 'var(--color-muted, #888)', fontSize: 11 }}
                        tickLine={false}
                    >
                        <Label value="Biên an toàn (%)" angle={-90} position="insideLeft" offset={10} style={{ fill: 'var(--color-muted, #888)', fontSize: 11 }} />
                    </YAxis>
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={20} stroke="#eab308" strokeDasharray="4 4" label={{ value: '20%', fill: '#eab308', fontSize: 10 }} />
                    <Scatter data={formatted} fillOpacity={0.8}>
                        {formatted.map((entry, idx) => (
                            <Cell key={idx} fill={getColor(entry.margin_of_safety)} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-3 text-xs text-muted">
                <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-green-500 inline-block" /> ≥ 40%</span>
                <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-indigo-500 inline-block" /> ≥ 30%</span>
                <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-yellow-500 inline-block" /> ≥ 20%</span>
                <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-red-500 inline-block" /> &lt; 20%</span>
            </div>
        </div>
    );
}
