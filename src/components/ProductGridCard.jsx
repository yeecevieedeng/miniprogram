// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Plus } from 'lucide-react';

export function ProductGridCard({
  product,
  onAddToCart
}) {
  return <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-40 object-cover" />
        {product.isHot && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            热销
          </span>}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2">{product.specification || '默认规格'}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-red-500 font-bold">¥{product.price?.toFixed(2)}</span>
            {product.originalPrice && <span className="text-xs text-gray-400 line-through ml-1">
                ¥{product.originalPrice?.toFixed(2)}
              </span>}
          </div>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-indigo-500 text-white hover:bg-indigo-600" onClick={onAddToCart}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>;
}