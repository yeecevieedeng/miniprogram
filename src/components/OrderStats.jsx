// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Package, Truck, MessageSquare, RotateCcw } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent } from '@/components/ui';

export function OrderStats({
  onOrderClick
}) {
  const stats = [{
    icon: Package,
    label: '待发货',
    count: 2,
    color: 'text-orange-500'
  }, {
    icon: Truck,
    label: '待收货',
    count: 3,
    color: 'text-blue-500'
  }, {
    icon: MessageSquare,
    label: '我的订单',
    count: 12,
    color: 'text-green-500'
  }, {
    icon: RotateCcw,
    label: '申请售后',
    count: 1,
    color: 'text-purple-500'
  }];
  return <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, index) => {
          const Icon = stat.icon;
          return <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => onOrderClick(stat.label)}>
              <Icon className={`w-6 h-6 mb-1 ${stat.color}`} />
              <span className="text-xs text-gray-600">{stat.label}</span>
              {stat.count > 0 && <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 mt-1">{stat.count}</span>}
            </div>;
        })}
        </div>
      </CardContent>
    </Card>;
}