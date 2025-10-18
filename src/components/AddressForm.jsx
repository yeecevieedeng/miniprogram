// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { MapPin, Phone, User } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Label, Checkbox } from '@/components/ui';

export function AddressForm({
  address,
  onSave,
  onCancel
}) {
  const [formData, setFormData] = useState({
    name: address?.name || '',
    phone: address?.phone || '',
    address: address?.address || '',
    isDefault: address?.isDefault || false
  });
  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      ...formData,
      id: address?.id || Date.now().toString()
    });
  };
  return <Card>
      <CardHeader>
        <CardTitle>{address ? '编辑收货地址' : '添加收货地址'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>收货人姓名</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input type="text" placeholder="请输入收货人姓名" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} className="pl-10" required />
            </div>
          </div>
          <div>
            <Label>手机号码</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input type="tel" placeholder="请输入手机号码" value={formData.phone} onChange={e => setFormData({
              ...formData,
              phone: e.target.value
            })} className="pl-10" required />
            </div>
          </div>
          <div>
            <Label>详细地址</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Input type="text" placeholder="请输入详细地址" value={formData.address} onChange={e => setFormData({
              ...formData,
              address: e.target.value
            })} className="pl-10" required />
            </div>
          </div>
          <div className="flex items-center">
            <Checkbox checked={formData.isDefault} onCheckedChange={checked => setFormData({
            ...formData,
            isDefault: checked
          })} />
            <Label className="ml-2">设为默认地址</Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              保存
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              取消
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>;
}