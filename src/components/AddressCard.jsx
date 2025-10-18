// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { MapPin, Phone, User, Edit, Trash2 } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent, Badge, Button } from '@/components/ui';

export function AddressCard({
  address,
  onEdit,
  onDelete,
  isDefault
}) {
  return <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <User className="w-4 h-4 text-gray-500 mr-2" />
              <span className="font-medium">{address.name}</span>
              {isDefault && <Badge variant="secondary" className="ml-2 text-xs">默认</Badge>}
            </div>
            <div className="flex items-center mb-1">
              <Phone className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">{address.phone}</span>
            </div>
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
              <span className="text-sm text-gray-600">{address.address}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => onEdit(address)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(address.id)}>
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
}