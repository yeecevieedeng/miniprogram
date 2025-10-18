// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent } from '@/components/ui';

export function ProductInfoTabs({
  description = '暂无描述'
}) {
  const [activeTab, setActiveTab] = useState('description');
  const tabs = [{
    id: 'description',
    label: '商品描述',
    content: <div className="prose prose-sm">
        <p>{description}</p>
        <h4 className="font-medium mt-4 mb-2">产品特点</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>精选优质食材，新鲜直达</li>
          <li>传统工艺熬制，营养丰富</li>
          <li>无添加防腐剂，健康安全</li>
          <li>适合各年龄段人群食用</li>
        </ul>
      </div>
  }];
  return <div>
      {/* 标签栏 */}
      <div className="flex border-b">
        {tabs.map(tab => <button key={tab.id} className={`flex-1 py-3 text-sm ${activeTab === tab.id ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>)}
      </div>
      
      {/* 内容区域 */}
      <div className="p-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>;
}