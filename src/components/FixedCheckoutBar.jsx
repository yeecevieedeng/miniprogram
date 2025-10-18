// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';

export const FixedCheckoutBar = ({
  totalAmount = 0,
  // 添加默认值0
  onSubmit,
  disabled
}) => {
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-600">合计: </span>
          <span className="text-xl font-bold text-red-600">¥{totalAmount.toFixed(2)}</span>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white px-8" onClick={onSubmit} disabled={disabled}>
          提交订单
        </Button>
      </div>
    </div>;
};