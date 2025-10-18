// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { X } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

export function CarouselModal({
  isOpen,
  onClose,
  mediaType,
  mediaUrl,
  title
}) {
  if (!isOpen) return null;
  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      <div className="relative bg-white rounded-lg max-w-4xl max-h-[90vh] w-full">
        {/* 关闭按钮 */}
        <Button variant="ghost" size="sm" className="absolute -top-10 right-0 text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full z-10" onClick={onClose}>
          <X className="w-6 h-6" />
        </Button>

        {/* 媒体内容 */}
        <div className="p-4">
          {mediaType === 'image' ? <img src={mediaUrl} alt={title} className="w-full h-auto max-h-[70vh] object-contain rounded-lg" /> : mediaType === 'video' ? <video src={mediaUrl} controls className="w-full h-auto max-h-[70vh] object-contain rounded-lg" /> : null}
          
          {/* 标题 */}
          {title && <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>}
        </div>
      </div>
    </div>;
}