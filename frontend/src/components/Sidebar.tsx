import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {


  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Tổng quan' },
    { id: 'canslim', icon: 'tune', label: 'Bộ lọc CANSLIM' },
    { id: 'value', icon: 'filter_alt', label: 'Bộ lọc Đầu tư giá trị' },
    { id: 'dividend', icon: 'payments', label: 'Bộ lọc Cổ tức' },
  ];

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col justify-between border-r border-line bg-sidebar p-4 hidden lg:flex">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shadow-lg ring-2 ring-line" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBaM6Lz0DHoV0tCsrmRN4fPMfDv89fSFPjeWGlZXVYKru3pyk2p_NSo9MWt-7Q8-twwr878ZEvdH6apLtg2UOHdUxxU7XdmtYLd52EakEwIOeOTFh7Liayb2_AYALZQJgTL_a4kYDMSK4O_6c6VhE_aJ0QGjil8SLYLZIFy6Ns_PAvvR0vturmXmP7p-m_EzalhpPd6-WzNBiHZwcO2qOXilRfnC8VJRM5f-coSMSMz2gQbHazdYaEggQINnHb0um0t1kxRh3wiDaGP")' }}></div>
          <div className="flex flex-col">
            <h1 className="text-heading text-lg font-bold leading-tight">TopInvestment</h1>
            <p className="text-muted text-xs font-medium uppercase tracking-wider">Đầu tư thông minh</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group w-full text-left ${activeTab === item.id
                ? 'bg-gradient-to-r from-el to-card border-l-4 border-primary shadow-sm'
                : 'hover:bg-el'
                }`}
            >
              <span className={`material-symbols-outlined ${activeTab === item.id ? 'text-primary' : 'text-muted group-hover:text-heading transition-colors'}`}>
                {item.icon}
              </span>
              <p className={`text-sm leading-normal transition-colors ${activeTab === item.id ? 'text-heading font-bold' : 'text-muted group-hover:text-heading font-medium'}`}>
                {item.label}
              </p>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">

        <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-el group w-full text-left">
          <span className="material-symbols-outlined text-muted group-hover:text-heading transition-colors">settings</span>
          <p className="text-muted group-hover:text-heading text-sm font-medium leading-normal transition-colors">Cài đặt</p>
        </button>
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-el to-sidebar border border-line">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-sm">diamond</span>
            </div>
            <p className="text-heading text-sm font-bold">Nâng cấp VIP</p>
          </div>
          <p className="text-muted text-xs mb-3">Mở khóa tính năng cao cấp ngay hôm nay.</p>
          <button className="w-full py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg transition-colors">Nâng cấp</button>
        </div>
      </div>
    </aside>
  );
}
