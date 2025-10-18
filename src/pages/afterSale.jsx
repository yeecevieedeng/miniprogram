// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { RotateCcw, Package, Clock, CheckCircle, XCircle, ChevronRight, Phone, MessageCircle } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Avatar, AvatarImage, useToast } from '@/components/ui';

// @ts-ignore;
import { TabBar } from '@/components/TabBar';

// 售后状态配置
const AFTER_SALE_STATUS = {
  ALL: '全部',
  PENDING: '申请中',
  APPROVED: '已同意',
  REJECTED: '已拒绝',
  COMPLETED: '已完成'
};
const STATUS_CONFIG = {
  PENDING: {
    color: 'orange',
    icon: Clock,
    description: '等待商家处理'
  },
  APPROVED: {
    color: 'green',
    icon: CheckCircle,
    description: '商家已同意'
  },
  REJECTED: {
    color: 'red',
    icon: XCircle,
    description: '申请被拒绝'
  },
  COMPLETED: {
    color: 'blue',
    icon: CheckCircle,
    description: '售后已完成'
  }
};

// 模拟售后订单数据
const afterSaleOrders = [{
  id: 'AS202412010001',
  orderId: '202412010003',
  type: '退货',
  status: 'PENDING',
  reason: '商品质量问题',
  amount: 88,
  createTime: '2024-12-01 15:30:00',
  images: ['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100'],
  item: {
    name: '当归羊肉汤',
    spec: '大份',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100'
  },
  shop: {
    name: '养生汤品专营店',
    avatar: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100'
  }
}, {
  id: 'AS202412010002',
  orderId: '202412010004',
  type: '仅退款',
  status: 'APPROVED',
  reason: '配送延迟',
  amount: 20,
  createTime: '2024-11-30 10:15:00',
  images: [],
  item: {
    name: '枸杞鸽子汤',
    spec: '小份',
    image: 'https://images.unsplash.com/photo-1559847844-d90f569e3166?w=100'
  },
  shop: {
    name: '养生汤品专营店',
    avatar: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100'
  }
}, {
  id: 'AS202412010003',
  orderId: '202412010005',
  type: '退货',
  status: 'COMPLETED',
  reason: '商品破损',
  amount: 58,
  createTime: '2024-11-29 14:20:00',
  images: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=100'],
  item: {
    name: '山药排骨汤',
    spec: '中份',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=100'
  },
  shop: {
    name: '养生汤品专营店',
    avatar: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100'
  }
}];

// 售后卡片组件
function AfterSaleCard({
  afterSale,
  onClick
}) {
  const statusConfig = STATUS_CONFIG[afterSale.status];
  const StatusIcon = statusConfig.icon;
  return <Card className="mb-4 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        {/* 头部信息 */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm font-medium">售后单号：{afterSale.id}</p>
            <p className="text-xs text-gray-500">{afterSale.createTime}</p>
          </div>
          <Badge variant={statusConfig.color} className="text-xs">
            <StatusIcon className="w-3 h-3 mr-1" />
            {AFTER_SALE_STATUS[afterSale.status]}
          </Badge>
        </div>

        {/* 商品信息 */}
        <div className="flex gap-3 py-2">
          <Avatar className="w-16 h-16 rounded">
            <AvatarImage src={afterSale.item.image} alt={afterSale.item.name} />
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{afterSale.item.name}</p>
            <p className="text-xs text-gray-500">{afterSale.item.spec}</p>
            <div className="flex justify-between items-center mt-1">
              <Badge variant="outline" className="text-xs">
                {afterSale.type}
              </Badge>
              <span className="text-sm font-semibold text-red-600">¥{afterSale.amount}</span>
            </div>
          </div>
        </div>

        {/* 售后原因 */}
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-gray-600">售后原因：{afterSale.reason}</p>
          {afterSale.images.length > 0 && <div className="flex gap-2 mt-2">
              {afterSale.images.map((img, index) => <Avatar key={index} className="w-12 h-12 rounded">
                  <AvatarImage src={img} alt="售后图片" />
                </Avatar>)}
            </div>}
        </div>

        {/* 底部操作 */}
        <div className="mt-3 pt-3 border-t flex gap-2 justify-end">
          <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={e => {
          e.stopPropagation();
          alert('联系客服');
        }}>
            <MessageCircle className="w-3 h-3" />
            联系客服
          </Button>
          {afterSale.status === 'PENDING' && <Button size="sm" variant="outline" onClick={e => {
          e.stopPropagation();
          alert('撤销申请');
        }}>
              撤销申请
            </Button>}
          {afterSale.status === 'APPROVED' && <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={e => {
          e.stopPropagation();
          alert('填写物流信息');
        }}>
              填写物流
            </Button>}
        </div>
      </CardContent>
    </Card>;
}
export default function AfterSale(props) {
  const {
    $w
  } = props;
  const [activeTab, setActiveTab] = React.useState('ALL');
  const [activeBottomTab, setActiveBottomTab] = React.useState('profile');
  const {
    toast
  } = useToast();

  // 过滤售后订单
  const filteredOrders = activeTab === 'ALL' ? afterSaleOrders : afterSaleOrders.filter(order => order.status === activeTab);
  const handleAfterSaleClick = afterSale => {
    $w.utils.navigateTo({
      pageId: 'afterSaleDetail',
      params: {
        afterSaleId: afterSale.id
      }
    });
  };
  const handleTabChange = tabId => {
    setActiveBottomTab(tabId);
    const pageMap = {
      home: 'home',
      order: 'order',
      cart: 'cart',
      profile: 'profile'
    };
    if (tabId !== 'profile') {
      $w.utils.navigateTo({
        pageId: pageMap[tabId]
      });
    }
  };
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部标题 */}
      <div className="bg-white shadow-sm">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={() => $w.utils.navigateBack()}>
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Button>
          <h1 className="text-lg font-semibold ml-4">申请售后</h1>
        </div>
      </div>

      {/* 售后状态Tab */}
      <div className="bg-white">
        <div className="flex border-b">
          {Object.entries(AFTER_SALE_STATUS).map(([key, value]) => <button key={key} className={`flex-1 py-3 text-sm ${activeTab === key ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`} onClick={() => setActiveTab(key)}>
              {value}
            </button>)}
        </div>
      </div>

      {/* 售后列表 */}
      <div className="p-4">
        {filteredOrders.length > 0 ? filteredOrders.map(afterSale => <AfterSaleCard key={afterSale.id} afterSale={afterSale} onClick={() => handleAfterSaleClick(afterSale)} />) : <div className="text-center py-8">
            <RotateCcw className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">暂无售后记录</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => $w.utils.navigateTo({
          pageId: 'order'
        })}>
              去申请售后
            </Button>
          </div>}
      </div>

      {/* 底部导航栏 */}
      <TabBar activeTab={activeBottomTab} onTabChange={handleTabChange} />
    </div>;
}