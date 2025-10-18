// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Badge } from '@/components/ui';

export function SpecificationSelector({
  specifications = [],
  selectedSpecs = {},
  onSpecChange
}) {
  if (!specifications || specifications.length === 0) {
    return null;
  }
  return <div className="space-y-3">
      {specifications.filter(spec => spec && spec.name && spec.options).map(spec => <div key={spec.name}>
          <h4 className="text-sm font-medium mb-2">{spec.name}</h4>
          <div className="flex flex-wrap gap-2">
            {spec.options.filter(option => option).map(option => {
          // 处理不同格式的选项
          const optionText = typeof option === 'object' ? option.label || option.value : option;
          const optionValue = typeof option === 'object' ? option.value : option;
          return <Badge key={optionValue} variant={selectedSpecs[spec.name] === optionValue ? "default" : "outline"} className={`cursor-pointer ${selectedSpecs[spec.name] === optionValue ? 'bg-green-600 text-white' : 'border-gray-300'}`} onClick={() => onSpecChange(spec.name, optionValue)}>
                  {optionText}
                </Badge>;
        })}
          </div>
        </div>)}
    </div>;
}