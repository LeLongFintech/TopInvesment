import React from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, Label, ZAxis
} from 'recharts';

interface BubblePoint {
    symbol: string;
    pe: number;
    pb: number;
    graham_number: number;
}

interface Props {
    data: BubblePoint[];
}

const PALETTE = [
    '#6366f1', '#8b5cf6', '#a78bfa', '#818cf8',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
    '#f59e0b', '#f97316', '#ef4444', '#ec4899',
];

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="bg-card border border-line rounded-lg px-3 py-2 shadow-xl text-xs">
            <p className="text-heading font-bold text-sm mb-1">{d.symbol}</p>
            <p className="text-muted">P/E: <span className="text-heading font-medium">{d.pe.toFixed(1)}</span></p>
            <p className="text-muted">P/B: <span className="text-heading font-medium">{d.pb.toFixed(2)}</span></p>
            <p className="text-muted">Graham No.: <span className="text-heading font-medium">{d.graham_number.toFixed(1)}</span></p>
        </div>
    );
};

export default function GrahamBubble({ data }: Props) {
    if (!data.length) return null;

    const maxGraham = Math.max(...data.map(d => d.graham_number));
    const minGraham = Math.min(...data.map(d => d.graham_number));

    return (
        <div className="bg-surface-alt border border-line rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">bubble_chart</span>
                <h3 className="text-heading font-bold">P/E vs P/B vs Graham Number</h3>
            </div>
            <p className="text-muted text-xs mb-4">
                Góc <strong>dưới-trái</strong> = Định giá thấp. Bong bóng <strong>to</strong> = Graham Number cao
            </p>
            <ResponsiveContainer width="100%" height={450}>
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
                        dataKey="pb"
                        name="P/B"
                        tick={{ fill: 'var(--color-muted, #888)', fontSize: 11 }}
                        tickLine={false}
                    >
                        <Label value="P/B Ratio" angle={-90} position="insideLeft" offset={10} style={{ fill: 'var(--color-muted, #888)', fontSize: 11 }} />
                    </YAxis>
                    <ZAxis
                        type="number"
                        dataKey="graham_number"
                        range={[60, 600]}
                        name="Graham Number"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter data={data} fillOpacity={0.7}>
                        {data.map((_, idx) => (
                            <Cell key={idx} fill={PALETTE[idx % PALETTE.length]} stroke={PALETTE[idx % PALETTE.length]} strokeWidth={1} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
            <p className="text-center text-muted text-xs mt-2">
                Kích thước bong bóng: Graham Number ({minGraham.toFixed(0)} – {maxGraham.toFixed(0)})
            </p>
        </div>
    );
}
