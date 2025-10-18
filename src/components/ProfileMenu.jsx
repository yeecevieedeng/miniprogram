// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { MapPin, Settings, HelpCircle } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent } from '@/components/ui';

export function ProfileMenu({
  onMenuClick
}) {
  const menuItems = [{
    icon: MapPin,
    label: '收货地址',
    description: '管理您的收货地址',
    action: 'address'
  }, {
    icon: Settings,
    label: '账户设置',
    description: '修改密码、绑定手机等',
    action: 'settings'
  }, {
    icon: HelpCircle,
    label: '帮助中心',
    description: '常见问题与客服',
    action: 'help'
  }];
  return <Card>
      <CardContent className="p-0">
        {menuItems.map((item, index) => {
        const Icon = item.icon;
        return <div key={index} className="flex items-center gap-3 p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50" onClick={() => onMenuClick(item.action)}>
            <Icon className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          </div>;
      })}
      </CardContent>
    </Card>;
}