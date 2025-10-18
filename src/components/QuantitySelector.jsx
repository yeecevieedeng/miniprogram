// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Plus, Minus } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

export function QuantitySelector({
  quantity,
  maxQuantity,
  onQuantityChange
}) {
  return <div className="flex items-center gap-3">
      <span className="text-sm font-medium">数量</span>
      <div className="flex items-center border rounded">
        <Button size="sm" variant="ghost" className="w-8 h-8 p-0" onClick={() => onQuantityChange(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-12 text-center text-sm">{quantity}</span>
        <Button size="sm" variant="ghost" className="w-8 h-8 p-0" onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))} disabled={quantity >= maxQuantity}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <span className="text-xs text-gray-500">库存 {maxQuantity} 件</span>
    </div>;
}