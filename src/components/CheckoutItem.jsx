// @ts-ignore;
import React from 'react';

export const CheckoutItem = ({
  item
}) => {
  return <div className="flex py-3 border-b last:border-b-0">
      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" onError={e => {
      e.target.src = 'https://via.placeholder.com/80';
    }} />
      <div className="ml-3 flex-1">
        <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
        <p className="text-xs text-gray-500 mt-1">{item.specification}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-red-600 font-medium">¥{item.price}</span>
          <span className="text-sm text-gray-500">x{item.quantity}</span>
        </div>
      </div>
    </div>;
};