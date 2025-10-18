// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Star } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';

export function FoodCard({
  food,
  onClick
}) {
  if (!food) {
    return null;
  }
  const {
    name,
    price,
    image,
    rating,
    reviews,
    tag
  } = food;
  return <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="aspect-[4/3] bg-gray-100">
        {image && image !== '' ? <img src={image} alt={name || '商品图片'} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">暂无图片</span>
          </div>}
      </div>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold line-clamp-1">
            {name || '商品名称'}
          </CardTitle>
          {tag && <Badge variant="secondary" className="text-xs">
              {tag}
            </Badge>}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-green-600">
              ¥{price || 0}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {rating || 0} ({reviews || 0})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>;
}