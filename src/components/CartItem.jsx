// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Trash2, Plus, Minus } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent, Button } from '@/components/ui';

export function CartItem({
  item,
  onQuantityChange,
  onRemove,
  onToggleSelect
}) {
  return <Card className="mb-3 overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {/* 左侧复选框 */}
          <input type="checkbox" checked={item.selected} onChange={() => onToggleSelect(item.id)} className="w-4 h-4 text-green-600 mt-12" />
          
          {/* 商品图片 - 放大 */}
          <div className="w-24 h-24 flex-shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
          </div>
          
          {/* 商品信息 */}
          <div className="flex-1 min-w-0">
            {/* 产品名称 */}
            <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h3>
            
            {/* 价格 */}
            <p className="text-red-600 font-bold text-sm mb-2">¥{item.price}</p>
            
            {/* 加减号 - 缩小并放在底部 */}
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" className="w-6 h-6 p-0" onClick={() => onQuantityChange(item.id, Math.max(0, item.quantity - 1))}>
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <Button size="sm" variant="outline" className="w-6 h-6 p-0" onClick={() => onQuantityChange(item.id, item.quantity + 1)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {/* 删除按钮 */}
          <Button size="sm" variant="ghost" className="p-1 h-auto" onClick={() => onRemove(item.id)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </CardContent>
    </Card>;
}