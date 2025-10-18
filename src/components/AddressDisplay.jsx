// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button, Badge } from '@/components/ui';
// @ts-ignore;
import { MapPin, Plus, Edit3 } from 'lucide-react';

export const AddressDisplay = ({
  address,
  onOpenModal,
  onEditAddress
}) => {
  if (!address) {
    return <div className="text-center py-4">
        <Button className="w-full" onClick={onOpenModal}>
          <Plus className="w-4 h-4 mr-2" />
          选择收货地址
        </Button>
      </div>;
  }
  return <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-medium">{address.name}</span>
        <span className="text-sm text-gray-500">{address.phone}</span>
        {address.is_default && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
            默认
          </Badge>}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {address.province} {address.city} {address.district} {address.address}
      </p>
      <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => onEditAddress(address)}>
        <Edit3 className="w-3 h-3 mr-1" />
        编辑地址
      </Button>
    </div>;
};