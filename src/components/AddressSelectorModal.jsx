// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button, Badge } from '@/components/ui';
// @ts-ignore;
import { Plus, Edit3 } from 'lucide-react';

export const AddressSelectorModal = ({
  isOpen,
  onClose,
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddAddress,
  onEditAddress
}) => {
  if (!isOpen) return null;

  // 检查地址数据是否有效
  const validAddresses = Array.isArray(addresses) ? addresses : [];
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>选择收货地址</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3 p-1">
            {validAddresses.length === 0 ? <div className="text-center py-8 text-gray-500">
                暂无地址，请添加新地址
              </div> : validAddresses.map(address => {
            // 确保地址对象包含必要的字段
            const safeAddress = {
              _id: address._id || '',
              name: address.name || '未知姓名',
              phone: address.phone || '未知电话',
              province: address.province || '',
              city: address.city || '',
              district: address.district || '',
              address: address.address || '',
              is_default: Boolean(address.is_default)
            };
            return <div key={safeAddress._id} className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedAddress?._id === safeAddress._id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`} onClick={() => {
              onSelectAddress(safeAddress);
              onClose();
            }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{safeAddress.name}</span>
                      <span className="text-sm text-gray-500">{safeAddress.phone}</span>
                      {safeAddress.is_default && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          默认
                        </Badge>}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {safeAddress.province} {safeAddress.city} {safeAddress.district} {safeAddress.address}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress?._id === safeAddress._id ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {selectedAddress?._id === safeAddress._id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>
                
                <div className="mt-2 flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs" onClick={e => {
                  e.stopPropagation();
                  onEditAddress(safeAddress);
                  onClose();
                }}>
                    <Edit3 className="w-3 h-3 mr-1" />
                    编辑
                  </Button>
                </div>
              </div>;
          })}
          </div>
        </div>
        
        <DialogFooter className="border-t pt-4">
          <Button className="w-full" onClick={() => {
          onAddAddress();
          onClose();
        }}>
            <Plus className="w-4 h-4 mr-2" />
            添加新地址
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};