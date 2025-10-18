// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { ShoppingCart, ShoppingBag } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

export function EmptyCart({
  onGoShopping
}) {
  return <div className="flex flex-col items-center justify-center h-64">
      <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
      <p className="text-gray-500 mb-4">购物车是空的</p>
      <Button onClick={onGoShopping} className="bg-green-600 hover:bg-green-700">
        <ShoppingBag className="w-4 h-4 mr-2" />
        去选购商品
      </Button>
    </div>;
}