import React from 'react';

// ── Data ──────────────────────────────────────────────
const stats = [
  { icon: 'apartment', value: '800+', label: 'Doanh nghiệp niêm yết', sub: 'SET & mai' },
  { icon: 'account_balance_wallet', value: '~$550B', label: 'Vốn hóa thị trường', sub: 'USD (2024)' },
  { icon: 'swap_horiz', value: '~$2–3B', label: 'GTGD trung bình/ngày', sub: 'Thanh khoản cao' },
  { icon: 'public', value: 'Top 3', label: 'Đông Nam Á', sub: 'Quy mô ASEAN' },
];

const timeline = [
  { year: '1960s', title: 'Bangkok Stock Exchange (BSE)', desc: 'Mô hình tiền thân — thị trường tư nhân đầu tiên, tuy nhiên còn thiếu khung pháp lý và cơ chế giám sát hiệu quả.', color: 'bg-slate-500' },
  { year: '1975', title: 'SET chính thức hoạt động', desc: 'Ngày 30/04/1975, SET đi vào hoạt động theo Đạo luật SET B.E. 2517, chuyển đổi từ mô hình tư nhân sang giám sát Nhà nước.', color: 'bg-blue-500' },
  { year: '1975–1991', title: 'Xây dựng nền tảng', desc: 'Tập trung pháp lý, chuẩn mực công bố thông tin, hoàn thiện cơ chế niêm yết và quản trị doanh nghiệp ban đầu.', color: 'bg-cyan-500' },
  { year: '1997', title: 'Khủng hoảng tài chính châu Á', desc: 'Cải cách sâu rộng: quản trị doanh nghiệp, chuẩn mực kế toán, hệ thống giao dịch — bước ngoặt cho sự phát triển bền vững.', color: 'bg-amber-500' },
  { year: '2012', title: 'Hiện đại hóa công nghệ', desc: 'Hệ thống giao dịch điện tử mới, nâng cao tốc độ xử lý lệnh và cải thiện đáng kể tính thanh khoản thị trường.', color: 'bg-emerald-500' },
  { year: '2020+', title: 'Chuyển đổi số', desc: 'Định hướng phát triển sản phẩm phái sinh, tích hợp tài sản kỹ thuật số, và đẩy mạnh chuyển đổi số toàn diện.', color: 'bg-primary' },
];

const indices = [
  { name: 'SET Index', desc: 'Chỉ số trung tâm — tính theo vốn hóa thị trường điều chỉnh free-float, phản ánh biến động giá toàn bộ cổ phiếu niêm yết. Được xem là "phong vũ biểu" của nền kinh tế Thái Lan.', icon: 'show_chart', accent: 'from-primary to-pink-600' },
  { name: 'SET50 Index', desc: 'Đại diện 50 cổ phiếu vốn hóa lớn và thanh khoản cao nhất — tài sản cơ sở cho hợp đồng tương lai trên TFEX và các quỹ ETF.', icon: 'leaderboard', accent: 'from-blue-500 to-cyan-500' },
  { name: 'SET100 Index', desc: 'Mở rộng thêm 50 cổ phiếu so với SET50 — vai trò quan trọng đối với nhà đầu tư tổ chức và dòng vốn quốc tế.', icon: 'stacked_line_chart', accent: 'from-emerald-500 to-teal-500' },
];

const features = [
  { icon: 'water_drop', title: 'Thanh khoản cao', desc: 'Cơ cấu ngành đa dạng: Năng lượng, Tài chính – Ngân hàng, Hàng tiêu dùng và Du lịch chiếm tỷ trọng lớn, phản ánh khá đầy đủ cấu trúc kinh tế quốc gia.', gradient: 'from-blue-500/20 to-blue-600/5' },
  { icon: 'category', title: 'Hệ sinh thái sản phẩm phong phú', desc: 'Cổ phiếu, trái phiếu, chứng chỉ lưu ký (DR), quỹ đầu tư hạ tầng, REITs và các sản phẩm phái sinh — đa dạng công cụ đầu tư.', gradient: 'from-emerald-500/20 to-emerald-600/5' },
  { icon: 'eco', title: 'Đầu tư bền vững (ESG)', desc: 'Nhiều doanh nghiệp Thái Lan tham gia Dow Jones Sustainability Indices, thể hiện cam kết cao với quản trị doanh nghiệp và phát triển bền vững.', gradient: 'from-amber-500/20 to-amber-600/5' },
];

// ── Component ─────────────────────────────────────────
export default function Dashboard() {
  return (
    <main className="flex-1 h-screen overflow-y-auto bg-page relative">
      {/* Background Gradient Glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/8 via-primary/3 to-transparent pointer-events-none"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="p-6 md:p-8 max-w-[1400px] mx-auto relative z-10">

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/8 via-surface to-primary/3 border border-line p-8 md:p-12">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
            <div className="absolute top-6 right-8 text-6xl opacity-20 select-none">🇹🇭</div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                  Tổng quan thị trường
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-heading leading-tight mb-4">
                Stock Exchange of <br />
                <span className="bg-gradient-to-r from-primary via-pink-400 to-primary bg-clip-text text-transparent">Thailand (SET)</span>
              </h1>
              <p className="text-muted text-base md:text-lg max-w-3xl leading-relaxed">
                Một trong những thị trường vốn phát triển sớm và có cấu trúc tương đối hoàn thiện trong khu vực ASEAN,
                với hơn 800 doanh nghiệp niêm yết và tổng vốn hóa khoảng 500–600 tỷ USD.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════ STAT CARDS ═══════════════ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-surface border border-line rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 group">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-heading">{s.value}</h3>
                  <p className="text-muted text-sm font-medium">{s.label}</p>
                  <p className="text-muted/70 text-xs mt-0.5">{s.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ═══════════════ SECTION 1: TIMELINE ═══════════════ */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">history</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-heading">Quá trình hình thành và phát triển</h2>
              <p className="text-muted text-sm">Từ BSE (1960s) đến SET hiện đại</p>
            </div>
          </div>

          <div className="bg-surface border border-line rounded-2xl p-6 md:p-8">
            <p className="text-body text-sm leading-relaxed mb-8">
              Stock Exchange of Thailand (SET) là một trong những thị trường vốn phát triển sớm và có cấu trúc tương đối hoàn thiện trong khu vực ASEAN.
              Quá trình hình thành thị trường bắt đầu từ những năm 1960 với mô hình tiền thân là Bangkok Stock Exchange (BSE).
            </p>

            {/* Vertical Timeline */}
            <div className="relative">
              <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-muted/30 via-primary/50 to-primary rounded-full"></div>

              <div className="flex flex-col gap-6">
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="relative z-10 flex-shrink-0 mt-1">
                      <div className={`size-[14px] rounded-full ${item.color} ring-4 ring-surface group-hover:ring-el transition-colors`}></div>
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-primary font-bold text-sm">{item.year}</span>
                        <span className="text-heading font-semibold text-sm">{item.title}</span>
                      </div>
                      <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ SECTION 2: CẤU TRÚC THỊ TRƯỜNG ═══════════════ */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <span className="material-symbols-outlined">account_tree</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-heading">Quy mô và cấu trúc thị trường</h2>
              <p className="text-muted text-sm">Main Board, mai & TFEX</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-surface border border-line rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <span className="material-symbols-outlined">domain</span>
                </div>
                <div>
                  <h3 className="text-heading font-bold text-lg">Main Board (SET)</h3>
                  <span className="text-xs text-blue-400 font-medium">Sàn chính</span>
                </div>
              </div>
              <p className="text-muted text-sm leading-relaxed">
                Dành cho các doanh nghiệp quy mô lớn, yêu cầu cao về vốn hóa, lợi nhuận và quản trị minh bạch.
                Là nơi niêm yết của đa số blue-chip Thái Lan.
              </p>
            </div>

            <div className="bg-surface border border-line rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <span className="material-symbols-outlined">rocket_launch</span>
                </div>
                <div>
                  <h3 className="text-heading font-bold text-lg">Market for Alternative Investment (mai)</h3>
                  <span className="text-xs text-emerald-400 font-medium">Sàn tăng trưởng</span>
                </div>
              </div>
              <p className="text-muted text-sm leading-relaxed">
                Dành cho doanh nghiệp vừa và nhỏ, công ty tăng trưởng với tiêu chuẩn niêm yết linh hoạt hơn —
                cơ hội cho các doanh nghiệp mới nổi.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/5 to-surface border border-line rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <span className="material-symbols-outlined">candlestick_chart</span>
              </div>
              <div>
                <h3 className="text-heading font-bold text-lg">Thailand Futures Exchange (TFEX)</h3>
                <span className="text-xs text-purple-400 font-medium">Thị trường phái sinh</span>
              </div>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Cung cấp hợp đồng tương lai và quyền chọn dựa trên chỉ số, cổ phiếu đơn lẻ, vàng và các tài sản tài chính khác.
              Góp phần nâng cao hiệu quả định giá, tạo công cụ phòng ngừa rủi ro và cải thiện thanh khoản thị trường cơ sở.
            </p>
          </div>

          <div className="mt-4 bg-surface border border-line rounded-2xl p-6">
            <p className="text-body text-sm leading-relaxed">
              Tính đến năm 2024, SET có hơn 800 doanh nghiệp niêm yết trên hai bảng chính, với tổng vốn hóa thị trường dao động khoảng
              500–600 tỷ USD. Giá trị giao dịch trung bình ngày thường đạt mức vài tỷ USD, phản ánh tính thanh khoản tương đối cao so với các thị trường trong khu vực.
              Cơ cấu nhà đầu tư bao gồm cả cá nhân và tổ chức, trong đó dòng vốn nước ngoài đóng vai trò quan trọng trong việc định hình xu hướng ngắn và trung hạn.
            </p>
          </div>
        </section>

        {/* ═══════════════ SECTION 3: HỆ THỐNG CHỈ SỐ ═══════════════ */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <span className="material-symbols-outlined">monitoring</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-heading">Hệ thống chỉ số</h2>
              <p className="text-muted text-sm">Vai trò định hướng thị trường</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {indices.map((idx, i) => (
              <div key={i} className="bg-surface border border-line rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group">
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${idx.accent} mb-4`}>
                  <span className="material-symbols-outlined text-white text-2xl">{idx.icon}</span>
                </div>
                <h3 className="text-heading font-bold text-lg mb-2">{idx.name}</h3>
                <p className="text-muted text-sm leading-relaxed">{idx.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-line rounded-2xl p-6">
            <p className="text-body text-sm leading-relaxed">
              Ngoài các chỉ số truyền thống, thị trường còn phát triển các <span className="text-heading font-medium">chỉ số ngành</span> và
              <span className="text-heading font-medium"> chỉ số bền vững</span> nhằm đáp ứng xu hướng đầu tư ESG,
              góp phần nâng cao tính đa dạng của sản phẩm đầu tư.
            </p>
          </div>
        </section>

        {/* ═══════════════ SECTION 4: PHÁP LÝ & GIÁM SÁT ═══════════════ */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <span className="material-symbols-outlined">gavel</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-heading">Khuôn khổ pháp lý và cơ chế giám sát</h2>
              <p className="text-muted text-sm">SEC Thailand & Securities Act</p>
            </div>
          </div>

          <div className="bg-surface border border-line rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 mb-3">
                  <span className="material-symbols-outlined text-3xl">shield</span>
                </div>
                <h4 className="text-heading font-bold text-sm mb-2">SEC Thailand</h4>
                <p className="text-muted text-xs leading-relaxed">
                  Cơ quan độc lập — xây dựng chính sách, cấp phép và giám sát hoạt động phát hành, niêm yết, môi giới.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 mb-3">
                  <span className="material-symbols-outlined text-3xl">description</span>
                </div>
                <h4 className="text-heading font-bold text-sm mb-2">Securities and Exchange Act</h4>
                <p className="text-muted text-xs leading-relaxed">
                  Nguyên tắc giao dịch công bằng, minh bạch — xử lý thao túng giá và giao dịch nội gián.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 mb-3">
                  <span className="material-symbols-outlined text-3xl">token</span>
                </div>
                <h4 className="text-heading font-bold text-sm mb-2">Tài sản kỹ thuật số</h4>
                <p className="text-muted text-xs leading-relaxed">
                  Mở rộng sang ETF tiền mã hóa, công nhận tài sản số trong hợp đồng phái sinh — hội nhập tài chính toàn cầu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ SECTION 5: ĐẶC ĐIỂM NỔI BẬT ═══════════════ */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">star</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-heading">Đặc điểm nổi bật và vị thế khu vực</h2>
              <p className="text-muted text-sm">Vì sao SET quan trọng trong ASEAN</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className={`bg-gradient-to-br ${f.gradient} border border-line rounded-2xl p-6 hover:border-primary/20 transition-all duration-300`}>
                <div className="p-2.5 rounded-xl bg-heading/5 text-heading inline-flex mb-4">
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <h3 className="text-heading font-bold mb-2">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ SECTION 6: TRIỂN VỌNG ═══════════════ */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-heading">Thách thức và triển vọng 2025–2026</h2>
              <p className="text-muted text-sm">Cơ hội trong biến động</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-red-500/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-red-400">warning</span>
                <h3 className="text-red-400 font-bold">Thách thức</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <p className="text-muted text-sm leading-relaxed">Tăng trưởng kinh tế chậm lại, biến động lãi suất toàn cầu</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <p className="text-muted text-sm leading-relaxed">Dịch chuyển dòng vốn quốc tế gây áp lực lên chỉ số</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  <p className="text-muted text-sm leading-relaxed">Niềm tin nhà đầu tư có thời điểm suy giảm</p>
                </li>
              </ul>
            </div>

            <div className="bg-surface border border-emerald-500/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-emerald-400">lightbulb</span>
                <h3 className="text-emerald-400 font-bold">Triển vọng tích cực</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">•</span>
                  <p className="text-muted text-sm leading-relaxed">Thúc đẩy kinh tế số, phát triển hạ tầng và mở rộng sản phẩm tài chính</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">•</span>
                  <p className="text-muted text-sm leading-relaxed">GDP dự báo cải thiện 2026 — động lực cho cổ phiếu chu kỳ và công nghệ</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">•</span>
                  <p className="text-muted text-sm leading-relaxed">Đẩy mạnh ETF, nới lỏng quy định nhà đầu tư nước ngoài</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ═══════════════ KẾT LUẬN ═══════════════ */}
        <section className="mb-10">
          <div className="relative bg-gradient-to-br from-primary/8 via-surface to-primary/3 border border-line rounded-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <h3 className="text-heading font-bold text-lg">Kết luận</h3>
              </div>
              <blockquote className="border-l-4 border-primary pl-5">
                <p className="text-body text-sm leading-relaxed">
                  Nhìn chung, thị trường chứng khoán Thái Lan là một hệ thống tài chính có cấu trúc hoàn chỉnh, quy mô lớn và mức độ hội nhập cao
                  trong khu vực ASEAN. Với nền tảng pháp lý vững chắc, hệ sinh thái sản phẩm đa dạng và định hướng đổi mới công nghệ, SET tiếp tục
                  đóng vai trò trung tâm trong việc huy động vốn và phân bổ nguồn lực cho nền kinh tế Thái Lan.
                </p>
                <p className="text-body text-sm leading-relaxed mt-3">
                  Mặc dù đối mặt với thách thức ngắn hạn từ môi trường vĩ mô, triển vọng trung và dài hạn vẫn được đánh giá tích cực
                  nhờ các cải cách cấu trúc và chiến lược phát triển thị trường vốn bền vững.
                </p>
              </blockquote>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
