import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';

interface ShieldDataItem {
    symbol: string;
    current_ratio: number;
    de_ratio: number;
}

interface Props {
    data: ShieldDataItem[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-card border border-line rounded-lg px-3 py-2 shadow-xl text-xs">
            <p className="text-heading font-bold mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} style={{ color: p.fill }}>
                    {p.name}: <span className="font-bold">{p.value?.toFixed(2)}</span>
                </p>
            ))}
        </div>
    );
};

export default function GrahamShieldBar({ data }: Props) {
    if (!data.length) return null;

    return (
        <div className="bg-surface-alt border border-line rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">shield</span>
                <h3 className="text-heading font-bold">Bảng xếp hạng "Lá Chắn Tài Chính" — Top 15</h3>
            </div>
            <p className="text-muted text-xs mb-4">
                Cột <span className="text-cyan-400 font-bold">CR</span> phải vượt đường mốc 2.0 (thanh khoản dồi dào) |
                Cột <span className="text-orange-400 font-bold">D/E</span> phải nằm dưới đường mốc 1.0 (ít nợ vay)
            </p>
            <ResponsiveContainer width="100%" height={420}>
                <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line, #333)" opacity={0.4} />
                    <XAxis
                        dataKey="symbol"
                        tick={{ fill: 'var(--color-muted, #888)', fontSize: 10 }}
                        tickLine={false}
                        interval={0}
                        angle={-35}
                        textAnchor="end"
                        height={50}
                    />
                    <YAxis
                        tick={{ fill: 'var(--color-muted, #888)', fontSize: 10 }}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        iconType="rect"
                        iconSize={12}
                        formatter={(value: string) => (
                            <span className="text-muted text-xs">{value}</span>
                        )}
                    />

                    {/* Reference lines */}
                    <ReferenceLine
                        y={2.0}
                        stroke="#22d3ee"
                        strokeDasharray="6 3"
                        strokeWidth={1.5}
                        label={{ value: 'CR = 2.0', fill: '#22d3ee', fontSize: 10, position: 'right' }}
                    />
                    <ReferenceLine
                        y={1.0}
                        stroke="#f97316"
                        strokeDasharray="6 3"
                        strokeWidth={1.5}
                        label={{ value: 'D/E = 1.0', fill: '#f97316', fontSize: 10, position: 'right' }}
                    />

                    {/* CR bar */}
                    <Bar
                        dataKey="current_ratio"
                        name="Thanh toán hiện hành (CR)"
                        fill="#06b6d4"
                        radius={[4, 4, 0, 0]}
                        barSize={18}
                    />

                    {/* D/E bar */}
                    <Bar
                        dataKey="de_ratio"
                        name="Nợ / VCSH (D/E)"
                        fill="#f97316"
                        radius={[4, 4, 0, 0]}
                        barSize={18}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
