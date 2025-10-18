// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ChevronLeft, ChevronRight } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

export function ProductImageGallery({
  images,
  currentImage,
  onImageChange
}) {
  return <div className="relative">
      {/* 主图片 */}
      <div className="w-full h-80 bg-gray-100">
        <img src={images[currentImage]} alt="商品图片" className="w-full h-full object-cover" />
      </div>
      
      {/* 左右切换按钮 */}
      <Button variant="ghost" size="sm" className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80" onClick={() => onImageChange(Math.max(0, currentImage - 1))}>
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80" onClick={() => onImageChange(Math.min(images.length - 1, currentImage + 1))}>
        <ChevronRight className="w-5 h-5" />
      </Button>
      
      {/* 缩略图指示器 */}
      <div className="flex justify-center gap-2 mt-2">
        {images.map((_, index) => <button key={index} className={`w-2 h-2 rounded-full ${index === currentImage ? 'bg-green-600' : 'bg-gray-300'}`} onClick={() => onImageChange(index)} />)}
      </div>
    </div>;
}