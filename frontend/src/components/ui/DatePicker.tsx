import React, { useState, useRef, useEffect, useCallback } from 'react';

interface DatePickerProps {
    value: string;                    // YYYY-MM-DD
    onChange: (date: string) => void;
    minDate?: string;                 // default: 2000-01-01
    maxDate?: string;                 // default: 2025-12-31
    placeholder?: string;
}

const MONTHS = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];
const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const MIN_YEAR = 2000;
const MAX_YEAR = 2025;

function daysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

function pad(n: number) {
    return n.toString().padStart(2, '0');
}

export default function DatePicker({
    value,
    onChange,
    minDate = '2000-01-01',
    maxDate = '2025-12-31',
    placeholder = 'Chọn ngày...',
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Parse current value or default to today (clamped)
    const parsed = value ? new Date(value) : new Date();
    const clampedYear = Math.max(MIN_YEAR, Math.min(MAX_YEAR, parsed.getFullYear()));
    const [viewYear, setViewYear] = useState(clampedYear);
    const [viewMonth, setViewMonth] = useState(parsed.getMonth());
    const [mode, setMode] = useState<'days' | 'months' | 'years'>('days');

    // Close on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const minD = new Date(minDate);
    const maxD = new Date(maxDate);

    const isDisabled = useCallback((y: number, m: number, d: number) => {
        const dt = new Date(y, m, d);
        return dt < minD || dt > maxD;
    }, [minDate, maxDate]);

    const selectDate = (day: number) => {
        const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
        onChange(dateStr);
        setOpen(false);
    };

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => Math.max(MIN_YEAR, y - 1)); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => Math.min(MAX_YEAR, y + 1)); }
        else setViewMonth(m => m + 1);
    };

    // Format display value
    const displayValue = value
        ? new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : '';

    // Days grid
    const totalDays = daysInMonth(viewYear, viewMonth);
    const startDay = firstDayOfMonth(viewYear, viewMonth);
    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);

    // Years grid (for year picker)
    const years: number[] = [];
    for (let y = MIN_YEAR; y <= MAX_YEAR; y++) years.push(y);

    return (
        <div className="relative" ref={ref}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-2 h-10 px-4 rounded-xl bg-card border text-sm font-medium transition-all w-full ${open
                        ? 'border-primary ring-2 ring-primary/20 text-heading'
                        : 'border-line text-heading hover:border-primary/50'
                    }`}
            >
                <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                <span className={displayValue ? 'text-heading' : 'text-muted'}>
                    {displayValue || placeholder}
                </span>
                <span className="material-symbols-outlined text-muted text-sm ml-auto">
                    {open ? 'expand_less' : 'expand_more'}
                </span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-12 left-0 z-50 w-[320px] bg-card border border-line rounded-xl shadow-2xl shadow-black/20 p-4 animate-in fade-in slide-in-from-top-2">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={prevMonth}
                            className="size-8 rounded-lg bg-el hover:bg-primary/20 flex items-center justify-center text-heading transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>

                        <button
                            onClick={() => setMode(mode === 'days' ? 'months' : mode === 'months' ? 'years' : 'days')}
                            className="px-3 py-1 rounded-lg text-heading font-bold text-sm hover:bg-el transition-colors"
                        >
                            {mode === 'years' ? `${MIN_YEAR} – ${MAX_YEAR}` : `${MONTHS[viewMonth]} ${viewYear}`}
                        </button>

                        <button
                            onClick={nextMonth}
                            className="size-8 rounded-lg bg-el hover:bg-primary/20 flex items-center justify-center text-heading transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>

                    {/* Year picker */}
                    {mode === 'years' && (
                        <div className="grid grid-cols-4 gap-1.5 max-h-[240px] overflow-y-auto pr-1">
                            {years.map(y => (
                                <button
                                    key={y}
                                    onClick={() => { setViewYear(y); setMode('months'); }}
                                    className={`py-2 rounded-lg text-xs font-medium transition-colors ${y === viewYear
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-heading hover:bg-el'
                                        }`}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Month picker */}
                    {mode === 'months' && (
                        <div className="grid grid-cols-3 gap-1.5">
                            {MONTHS.map((m, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setViewMonth(idx); setMode('days'); }}
                                    className={`py-2.5 rounded-lg text-xs font-medium transition-colors ${idx === viewMonth
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-heading hover:bg-el'
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Days grid */}
                    {mode === 'days' && (
                        <>
                            <div className="grid grid-cols-7 mb-1">
                                {WEEKDAYS.map(wd => (
                                    <div key={wd} className="text-center text-muted text-[10px] font-bold uppercase py-1">
                                        {wd}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-0.5">
                                {days.map((day, idx) => {
                                    if (day === null) return <div key={`e-${idx}`} />;

                                    const disabled = isDisabled(viewYear, viewMonth, day);
                                    const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
                                    const isSelected = value === dateStr;
                                    const isToday = dateStr === new Date().toISOString().slice(0, 10);

                                    return (
                                        <button
                                            key={day}
                                            disabled={disabled}
                                            onClick={() => selectDate(day)}
                                            className={`size-9 rounded-lg text-xs font-medium flex items-center justify-center transition-all ${disabled
                                                    ? 'text-muted/30 cursor-not-allowed'
                                                    : isSelected
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                                        : isToday
                                                            ? 'bg-primary/15 text-primary font-bold ring-1 ring-primary/30'
                                                            : 'text-heading hover:bg-el'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Quick selects */}
                    <div className="flex gap-1.5 mt-3 pt-3 border-t border-line">
                        {[
                            { label: '31/12/2024', date: '2024-12-31' },
                            { label: '31/12/2023', date: '2023-12-31' },
                            { label: '31/12/2020', date: '2020-12-31' },
                        ].map(q => (
                            <button
                                key={q.date}
                                onClick={() => { onChange(q.date); setOpen(false); }}
                                className="flex-1 py-1.5 rounded-lg bg-el text-heading text-[10px] font-bold hover:bg-primary/20 transition-colors"
                            >
                                {q.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
