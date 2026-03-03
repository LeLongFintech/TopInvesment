import React from 'react';

export default function ValueFilter() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-page relative">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-sidebar/90 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="lg:hidden"><span className="material-symbols-outlined text-heading cursor-pointer">menu</span></div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded bg-el text-primary"><span className="material-symbols-outlined">candlestick_chart</span></div>
            <h2 className="text-heading text-xl font-bold tracking-tight">Bộ lọc Đầu tư giá trị</h2>
          </div>
          <div className="hidden md:flex h-10 w-96 items-center rounded-xl bg-card px-3 ring-1 ring-inset ring-line focus-within:ring-primary">
            <span className="material-symbols-outlined text-muted">search</span>
            <input className="w-full bg-transparent border-none text-heading placeholder-muted focus:ring-0 text-sm ml-2" placeholder="Tìm kiếm mã cổ phiếu..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-muted hover:text-heading transition-colors"><span className="material-symbols-outlined">notifications</span><span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary"></span></button>
          <button className="p-2 text-muted hover:text-heading transition-colors"><span className="material-symbols-outlined">help</span></button>
        </div>
      </header>
      <main className="flex-1 p-6 lg:p-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-line">
          <div className="max-w-2xl">
            <h1 className="text-3xl lg:text-4xl font-black text-heading mb-3 tracking-tight">Chiến lược Giá trị cốt lõi</h1>
            <p className="text-muted text-lg leading-relaxed">Tìm kiếm các doanh nghiệp có nền tảng tài chính vững chắc, đang bị thị trường định giá thấp hơn giá trị thực. <span className="text-primary font-medium cursor-pointer hover:underline ml-1">Tìm hiểu thêm</span></p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-el hover:bg-el/80 text-heading font-semibold transition-colors border border-transparent hover:border-primary/50"><span className="material-symbols-outlined text-sm">save</span>Lưu bộ lọc</button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/20 transition-all"><span className="material-symbols-outlined text-sm">play_arrow</span>Chạy bộ lọc</button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-heading text-lg font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary">tune</span>Tiêu chí lọc</h3>
              <button className="text-xs text-primary hover:text-primary-light font-bold uppercase tracking-wider">Reset tất cả</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-alt p-5 rounded-xl border border-line group hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4"><div><p className="text-muted text-xs font-bold uppercase tracking-wider mb-1">Định giá</p><h4 className="text-heading font-bold text-lg">P/E Ratio</h4></div><span className="px-2 py-1 rounded bg-el text-primary text-xs font-bold">&lt; 15.0</span></div>
                <div className="relative h-2 bg-el rounded-full overflow-hidden"><div className="absolute top-0 left-0 h-full w-[40%] bg-gradient-to-r from-primary to-purple-600 rounded-full"></div></div>
                <div className="flex justify-between mt-2 text-xs text-muted"><span>0</span><span>15</span><span>50+</span></div>
              </div>
              <div className="bg-surface-alt p-5 rounded-xl border border-line group hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4"><div><p className="text-muted text-xs font-bold uppercase tracking-wider mb-1">Hiệu quả</p><h4 className="text-heading font-bold text-lg">ROE</h4></div><span className="px-2 py-1 rounded bg-el text-green-400 text-xs font-bold">&gt; 15%</span></div>
                <div className="relative h-2 bg-el rounded-full overflow-hidden"><div className="absolute top-0 right-0 h-full w-[60%] bg-gradient-to-l from-green-400 to-green-600 rounded-full"></div></div>
                <div className="flex justify-between mt-2 text-xs text-muted"><span>0%</span><span>15%</span><span>100%</span></div>
              </div>
              <div className="bg-surface-alt p-5 rounded-xl border border-line group hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4"><div><p className="text-muted text-xs font-bold uppercase tracking-wider mb-1">An toàn</p><h4 className="text-heading font-bold text-lg">Margin of Safety</h4></div><span className="px-2 py-1 rounded bg-el text-primary text-xs font-bold">&gt; 20%</span></div>
                <div className="relative h-10 w-full pt-2"><input className="w-full h-1 bg-el rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg" max="100" min="0" type="range" defaultValue="20" /></div>
              </div>
              <div className="bg-surface-alt p-5 rounded-xl border border-line group hover:border-primary/50 transition-colors flex flex-col justify-center items-center text-center cursor-pointer hover:bg-card">
                <div className="size-10 rounded-full bg-el flex items-center justify-center mb-3 group-hover:bg-primary transition-colors"><span className="material-symbols-outlined text-heading group-hover:text-white transition-colors">add</span></div>
                <p className="text-heading font-medium">Thêm tiêu chí</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-el border border-line hover:border-primary/50 transition-all group"><span className="text-heading text-sm font-medium">Vốn hóa &gt; 1000 tỷ</span><span className="material-symbols-outlined text-muted text-sm group-hover:text-heading">close</span></button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-el border border-line hover:border-primary/50 transition-all group"><span className="text-heading text-sm font-medium">Ngành: Bất động sản</span><span className="material-symbols-outlined text-muted text-sm group-hover:text-heading">close</span></button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-el border border-line hover:border-primary/50 transition-all group"><span className="text-heading text-sm font-medium">P/B &lt; 2.0</span><span className="material-symbols-outlined text-muted text-sm group-hover:text-heading">close</span></button>
            </div>
          </div>
          <div className="lg:col-span-4 bg-surface-alt border border-line rounded-xl p-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6"><h3 className="text-heading text-lg font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary">compare_arrows</span>So sánh nhanh</h3></div>
            <div className="flex-1 flex gap-4">
              <div className="flex-1 flex flex-col gap-3 group cursor-pointer">
                <div className="relative bg-card border-2 border-primary/30 group-hover:border-primary rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all">
                  <div className="size-10 rounded-full bg-white flex items-center justify-center shadow-lg"><span className="text-black font-bold text-xs">VHM</span></div>
                  <p className="text-heading font-bold text-lg">VHM</p><p className="text-green-400 text-xs font-bold">+2.4%</p>
                  <div className="w-full h-[1px] bg-line my-1"></div>
                  <div className="w-full flex justify-between text-xs"><span className="text-muted">P/E</span><span className="text-heading font-medium">6.2</span></div>
                  <div className="w-full flex justify-between text-xs"><span className="text-muted">ROE</span><span className="text-heading font-medium">22%</span></div>
                </div>
                <button className="w-full py-1.5 text-xs font-bold text-muted hover:text-heading uppercase tracking-wider bg-card rounded hover:bg-el transition-colors">Chi tiết</button>
              </div>
              <div className="flex-1 flex flex-col gap-3 group cursor-pointer">
                <div className="relative bg-card border-2 border-dashed border-line hover:border-primary/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all h-full min-h-[180px]">
                  <div className="size-10 rounded-full bg-el flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-muted">add</span></div>
                  <p className="text-muted text-sm text-center font-medium">Thêm mã để so sánh</p>
                </div>
                <button className="w-full py-1.5 text-xs font-bold text-muted opacity-50 cursor-not-allowed uppercase tracking-wider bg-card rounded">Chi tiết</button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-surface-alt border border-line rounded-xl overflow-hidden shadow-xl shadow-black/10">
          <div className="p-5 border-b border-line flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3"><h3 className="text-heading text-lg font-bold">Kết quả lọc</h3><span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">12 kết quả</span></div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2"><span className="text-muted text-sm">Sắp xếp:</span><select className="bg-card border-none text-heading text-sm font-medium rounded-lg focus:ring-1 focus:ring-primary py-1.5 pl-3 pr-8 cursor-pointer"><option>Tiềm năng tăng giá</option><option>Vốn hóa giảm dần</option><option>P/E thấp nhất</option></select></div>
              <button className="p-2 text-muted hover:text-heading hover:bg-el rounded-lg transition-colors"><span className="material-symbols-outlined">download</span></button>
              <button className="p-2 text-muted hover:text-heading hover:bg-el rounded-lg transition-colors"><span className="material-symbols-outlined">view_column</span></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-card text-muted font-medium uppercase text-xs tracking-wider"><tr><th className="px-6 py-4">Mã CP</th><th className="px-6 py-4">Tên công ty</th><th className="px-6 py-4 text-right">Giá hiện tại</th><th className="px-6 py-4 text-right">Định giá thực</th><th className="px-6 py-4 text-right text-primary">Biên an toàn</th><th className="px-6 py-4 text-right">P/E</th><th className="px-6 py-4 text-right">ROE</th><th className="px-6 py-4 text-center">Hành động</th></tr></thead>
              <tbody className="divide-y divide-line">
                <tr className="group hover:bg-card/50 transition-colors"><td className="px-6 py-4 font-bold text-heading group-hover:text-primary transition-colors">FPT</td><td className="px-6 py-4 text-muted">CTCP FPT</td><td className="px-6 py-4 text-right text-heading font-medium">96,500</td><td className="px-6 py-4 text-right text-muted">120,000</td><td className="px-6 py-4 text-right"><div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 text-green-400 font-bold border border-green-500/20"><span className="material-symbols-outlined text-xs">trending_up</span>24.3%</div></td><td className="px-6 py-4 text-right text-heading">18.2</td><td className="px-6 py-4 text-right text-heading">28%</td><td className="px-6 py-4 text-center"><button className="text-muted hover:text-heading p-1 rounded hover:bg-el transition-colors"><span className="material-symbols-outlined">more_horiz</span></button></td></tr>
                <tr className="group hover:bg-card/50 transition-colors"><td className="px-6 py-4 font-bold text-heading group-hover:text-primary transition-colors">HPG</td><td className="px-6 py-4 text-muted">Tập đoàn Hòa Phát</td><td className="px-6 py-4 text-right text-heading font-medium">28,400</td><td className="px-6 py-4 text-right text-muted">38,000</td><td className="px-6 py-4 text-right"><div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 text-green-400 font-bold border border-green-500/20"><span className="material-symbols-outlined text-xs">trending_up</span>33.8%</div></td><td className="px-6 py-4 text-right text-heading">12.5</td><td className="px-6 py-4 text-right text-heading">21%</td><td className="px-6 py-4 text-center"><button className="text-muted hover:text-heading p-1 rounded hover:bg-el transition-colors"><span className="material-symbols-outlined">more_horiz</span></button></td></tr>
                <tr className="group hover:bg-card/50 transition-colors"><td className="px-6 py-4 font-bold text-heading group-hover:text-primary transition-colors">MBB</td><td className="px-6 py-4 text-muted">Ngân hàng Quân Đội</td><td className="px-6 py-4 text-right text-heading font-medium">21,100</td><td className="px-6 py-4 text-right text-muted">26,500</td><td className="px-6 py-4 text-right"><div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 font-bold border border-yellow-500/20"><span className="material-symbols-outlined text-xs">trending_flat</span>25.6%</div></td><td className="px-6 py-4 text-right text-heading">6.8</td><td className="px-6 py-4 text-right text-heading">24%</td><td className="px-6 py-4 text-center"><button className="text-muted hover:text-heading p-1 rounded hover:bg-el transition-colors"><span className="material-symbols-outlined">more_horiz</span></button></td></tr>
                <tr className="group hover:bg-card/50 transition-colors"><td className="px-6 py-4 font-bold text-heading group-hover:text-primary transition-colors">REE</td><td className="px-6 py-4 text-muted">Cơ điện lạnh REE</td><td className="px-6 py-4 text-right text-heading font-medium">62,000</td><td className="px-6 py-4 text-right text-muted">75,000</td><td className="px-6 py-4 text-right"><div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 text-primary font-bold border border-primary/20"><span className="material-symbols-outlined text-xs">trending_up</span>20.9%</div></td><td className="px-6 py-4 text-right text-heading">9.4</td><td className="px-6 py-4 text-right text-heading">16%</td><td className="px-6 py-4 text-center"><button className="text-muted hover:text-heading p-1 rounded hover:bg-el transition-colors"><span className="material-symbols-outlined">more_horiz</span></button></td></tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-line flex justify-center"><button className="text-muted hover:text-heading text-sm font-medium flex items-center gap-2 transition-colors">Xem tất cả kết quả<span className="material-symbols-outlined text-sm">arrow_forward</span></button></div>
        </div>
        <div className="pt-6 border-t border-line flex flex-col md:flex-row justify-between items-center text-muted text-sm">
          <p>© 2024 TopInvestment. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0"><a className="hover:text-heading" href="#">Điều khoản</a><a className="hover:text-heading" href="#">Bảo mật</a><a className="hover:text-heading" href="#">Hỗ trợ</a></div>
        </div>
      </main>
    </div>
  );
}
