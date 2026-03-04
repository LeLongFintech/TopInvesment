import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';

interface DataPoint {
    date: string;
    pe: number | null;
    pb: number | null;
}

interface Props {
    data: DataPoint[];
    symbol: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-card border border-line rounded-lg px-3 py-2 shadow-xl text-xs">
            <p className="text-muted mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} style={{ color: p.color }}>
                    {p.name}: <span className="font-bold">{p.value?.toFixed(1)}</span>
                </p>
            ))}
        </div>
    );
};

export default function GrahamHistoricalBands({ data, symbol }: Props) {
    if (!data.length) return null;

    const formatted = data
        .filter(d => d.pe !== null)
        .map(d => ({
            ...d,
            label: new Date(d.date).toLocaleDateString('vi-VN', { month: '2-digit', year: '2-digit' }),
        }));

    return (
        <div className="bg-surface-alt border border-line rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                <h3 className="text-heading font-bold">Định giá lịch sử P/E & P/B — {symbol}</h3>
            </div>
            <p className="text-muted text-xs mb-4">
                Đường <span className="text-yellow-400 font-bold">nét đứt</span> = ngưỡng Graham (P/E ≤ 15, P/B ≤ 1.5).
                Nằm <strong>dưới</strong> = cổ phiếu giá trị
            </p>
            <ResponsiveContainer width="100%" height={450}>
                <LineChart data={formatted} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line, #333)" opacity={0.4} />
                    <XAxis
                        dataKey="label"
                        tick={{ fill: 'var(--color-muted, #888)', fontSize: 10 }}
                        tickLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tick={{ fill: 'var(--color-muted, #888)', fontSize: 10 }}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        iconType="line"
                        iconSize={14}
                        formatter={(value: string) => (
                            <span className="text-muted text-xs">{value}</span>
                        )}
                    />

                    {/* Threshold lines */}
                    <ReferenceLine
                        y={15}
                        stroke="#eab308"
                        strokeDasharray="6 3"
                        strokeWidth={1.5}
                        label={{ value: 'P/E = 15', fill: '#eab308', fontSize: 10, position: 'right' }}
                    />
                    <ReferenceLine
                        y={1.5}
                        stroke="#f97316"
                        strokeDasharray="6 3"
                        strokeWidth={1.5}
                        label={{ value: 'P/B = 1.5', fill: '#f97316', fontSize: 10, position: 'right' }}
                    />

                    {/* P/E line */}
                    <Line
                        type="monotone"
                        dataKey="pe"
                        name="P/E Ratio"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                    />

                    {/* P/B line */}
                    <Line
                        type="monotone"
                        dataKey="pb"
                        name="P/B Ratio"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
