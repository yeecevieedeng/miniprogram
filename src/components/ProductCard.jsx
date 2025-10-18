// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { ShoppingCart } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent, Button, Badge } from '@/components/ui';

export function ProductCard({
  product,
  onAddToCart,
  onProductClick
}) {
  return <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onProductClick(product)}>
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
        {product.tags && product.tags.map((tag, index) => <Badge key={index} variant="secondary" className="absolute top-2 left-2 text-xs">
            {tag}
          </Badge>)}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-red-600">¥{product.price}</span>
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={e => {
          e.stopPropagation();
          onAddToCart(product);
        }}>
            <ShoppingCart className="w-4 h-4 mr-1" />
            加入购物车
          </Button>
        </div>
      </CardContent>
    </Card>;
}