import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface SectorSlice {
    industry: string;
    count: number;
    percentage: number;
}

interface Props {
    data: SectorSlice[];
}

const PALETTE = [
    '#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#a78bfa',
    '#10b981', '#818cf8', '#eab308', '#0ea5e9', '#d946ef',
];

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="bg-card border border-line rounded-lg px-3 py-2 shadow-xl text-xs">
            <p className="text-heading font-bold text-sm mb-1">{d.industry}</p>
            <p className="text-muted">{d.count} cổ phiếu ({d.percentage}%)</p>
        </div>
    );
};

const renderLabel = ({ industry, percentage }: any) => {
    if (percentage < 8) return '';
    return `${percentage}%`;
};

export default function SectorDonut({ data }: Props) {
    if (!data.length) return null;

    return (
        <div className="bg-surface-alt border border-line rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">donut_large</span>
                <h3 className="text-heading font-bold">Phân bổ ngành</h3>
            </div>
            <p className="text-muted text-xs mb-4">
                Cơ cấu ngành của các cổ phiếu vượt qua bộ lọc Graham
            </p>
            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="industry"
                        label={renderLabel}
                        labelLine={false}
                    >
                        {data.map((_, idx) => (
                            <Cell
                                key={idx}
                                fill={PALETTE[idx % PALETTE.length]}
                                stroke="var(--color-surface-alt, #1a1a2e)"
                                strokeWidth={2}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value: string) => (
                            <span className="text-muted text-xs">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
