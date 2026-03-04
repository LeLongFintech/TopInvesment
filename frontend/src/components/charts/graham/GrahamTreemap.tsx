import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface TreemapDataItem {
    symbol: string;
    industry: string;
    close_price: number;
    pe: number;
}

interface Props {
    data: TreemapDataItem[];
}

// Color scale: lower P/E → darker green (cheaper), higher P/E → lighter
function peColor(pe: number): string {
    if (pe <= 5) return '#166534';     // very deep green
    if (pe <= 8) return '#15803d';
    if (pe <= 10) return '#22c55e';
    if (pe <= 12) return '#4ade80';
    if (pe <= 15) return '#86efac';
    return '#bbf7d0';                  // light green (expensive-ish)
}

const CustomContent = (props: any) => {
    const { x, y, width, height, symbol, pe } = props;
    if (width < 30 || height < 20) return null;
    return (
        <g>
            <rect
                x={x} y={y} width={width} height={height}
                rx={4} ry={4}
                fill={peColor(pe ?? 15)}
                stroke="var(--color-page, #0a0e17)"
                strokeWidth={2}
                style={{ transition: 'fill 0.3s' }}
            />
            {width > 45 && height > 30 && (
                <>
                    <text
                        x={x + width / 2} y={y + height / 2 - 6}
                        textAnchor="middle" fill="white" fontSize={11} fontWeight="bold"
                    >
                        {symbol}
                    </text>
                    <text
                        x={x + width / 2} y={y + height / 2 + 10}
                        textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={9}
                    >
                        P/E {pe?.toFixed(1)}
                    </text>
                </>
            )}
        </g>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
        <div className="bg-card border border-line rounded-lg px-3 py-2 shadow-xl text-xs">
            <p className="text-heading font-bold">{d?.symbol}</p>
            <p className="text-muted">{d?.industry}</p>
            <p>Giá: <span className="text-heading font-bold">{d?.close_price?.toLocaleString()}</span></p>
            <p>P/E: <span className="text-heading font-bold">{d?.pe?.toFixed(1)}</span></p>
        </div>
    );
};

export default function GrahamTreemap({ data }: Props) {
    if (!data.length) return null;

    // Build nested data: group by industry
    const industryMap = new Map<string, any[]>();
    for (const item of data) {
        if (!industryMap.has(item.industry)) industryMap.set(item.industry, []);
        industryMap.get(item.industry)!.push({
            name: item.symbol,
            size: item.close_price,
            symbol: item.symbol,
            pe: item.pe,
            industry: item.industry,
        });
    }

    const treeData = Array.from(industryMap.entries()).map(([industry, children]) => ({
        name: industry,
        children,
    }));

    return (
        <div className="bg-surface-alt border border-line rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">grid_view</span>
                <h3 className="text-heading font-bold">Bản đồ Nhiệt Định giá theo Ngành</h3>
            </div>
            <p className="text-muted text-xs mb-1">
                Kích thước ô = Giá cổ phiếu | Màu sắc =  P/E (<span className="text-green-400 font-bold">xanh đậm</span> = rẻ, nhạt = đắt hơn)
            </p>
            {/* Color legend */}
            <div className="flex items-center gap-2 mb-4 text-[10px] text-muted">
                <span>P/E:</span>
                {[
                    { label: '≤5', color: '#166534' },
                    { label: '≤8', color: '#15803d' },
                    { label: '≤10', color: '#22c55e' },
                    { label: '≤12', color: '#4ade80' },
                    { label: '≤15', color: '#86efac' },
                    { label: '>15', color: '#bbf7d0' },
                ].map(l => (
                    <span key={l.label} className="flex items-center gap-1">
                        <span className="inline-block size-3 rounded" style={{ background: l.color }} />
                        {l.label}
                    </span>
                ))}
            </div>
            <ResponsiveContainer width="100%" height={450}>
                <Treemap
                    data={treeData}
                    dataKey="size"
                    aspectRatio={4 / 3}
                    content={<CustomContent />}
                >
                    <Tooltip content={<CustomTooltip />} />
                </Treemap>
            </ResponsiveContainer>
        </div>
    );
}
