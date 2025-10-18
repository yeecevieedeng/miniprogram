// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Home, ShoppingCart, Package, User } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

export function TabBar({
  activeTab,
  onTabChange
}) {
  const tabs = [{
    id: 'home',
    label: '首页',
    icon: Home,
    pageId: 'home'
  }, {
    id: 'order-new',
    label: '下单',
    icon: Package,
    pageId: 'order-new'
  }, {
    id: 'cart',
    label: '购物车',
    icon: ShoppingCart,
    pageId: 'cart'
  }, {
    id: 'profile',
    label: '我的',
    icon: User,
    pageId: 'profile'
  }];
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} className={`flex-1 flex flex-col items-center py-2 px-1 ${isActive ? 'text-green-600' : 'text-gray-500'}`} onClick={() => onTabChange(tab.id)}>
            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'fill-current' : ''}`} />
            <span className="text-xs">{tab.label}</span>
          </button>;
      })}
      </div>
    </div>;
}