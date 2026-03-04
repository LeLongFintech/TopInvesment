import React from 'react';
import {
    ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface DataPoint {
    date: string;
    close_price: number;
    graham_number: number | null;
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
                    {p.name}: <span className="font-bold">{p.value?.toLocaleString()}</span>
                </p>
            ))}
        </div>
    );
};

export default function GrahamPriceVsValue({ data, symbol }: Props) {
    if (!data.length) return null;

    // Format dates for display
    const formatted = data.map(d => ({
        ...d,
        label: new Date(d.date).toLocaleDateString('vi-VN', { month: '2-digit', year: '2-digit' }),
    }));

    return (
        <div className="bg-surface-alt border border-line rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">show_chart</span>
                <h3 className="text-heading font-bold">Giá thị trường vs. Graham Number — {symbol}</h3>
            </div>
            <p className="text-muted text-xs mb-4">
                Vùng <span className="text-green-400 font-bold">xanh</span> = Biên an toàn. Vùng càng rộng → cổ phiếu càng rẻ so với giá trị thực
            </p>
            <ResponsiveContainer width="100%" height={450}>
                <ComposedChart data={formatted} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <defs>
                        <linearGradient id="mosGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
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
                        tickFormatter={(v) => v.toLocaleString()}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        iconType="line"
                        iconSize={14}
                        formatter={(value: string) => (
                            <span className="text-muted text-xs">{value}</span>
                        )}
                    />

                    {/* Graham Number line (value line) */}
                    <Area
                        type="stepAfter"
                        dataKey="graham_number"
                        name="Graham Number (V)"
                        stroke="#22c55e"
                        strokeWidth={2}
                        fill="url(#mosGradient)"
                        strokeDasharray="6 3"
                        connectNulls
                    />

                    {/* Close Price line */}
                    <Line
                        type="monotone"
                        dataKey="close_price"
                        name="Giá đóng cửa"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        dot={false}
                        connectNulls
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
