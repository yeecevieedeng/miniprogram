// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, Badge, Button, Tabs, TabsContent, TabsList, TabsTrigger, useToast } from '@/components/ui';
// @ts-ignore;
import { Package, Truck, CheckCircle, Clock, MessageSquare, ShoppingBag, AlertCircle, ExternalLink, XCircle, RotateCcw, ChevronLeft } from 'lucide-react';

// 订单商品项组件
const OrderItem = ({
  item
}) => {
  return <div className="flex py-3 border-b last:border-b-0">
      <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-16 h-16 rounded-lg object-cover" onError={e => {
      e.target.src = 'https://via.placeholder.com/80';
    }} />
      <div className="ml-3 flex-1">
        <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
        {item.specification && <p className="text-xs text-gray-500 mt-1">{item.specification}</p>}
        <div className="flex justify-between items-center mt-2">
          <span className="text-red-600 font-medium">¥{item.price}</span>
          <span className="text-sm text-gray-500">x{item.quantity}</span>
        </div>
      </div>
    </div>;
};

// 订单状态标签组件
const OrderStatusBadge = ({
  status
}) => {
  const statusConfig = {
    'pending_payment': {
      label: '待付款',
      variant: 'destructive',
      icon: Clock,
      color: 'text-orange-600 bg-orange-100'
    },
    'pending_shipment': {
      label: '待发货',
      variant: 'default',
      icon: Package,
      color: 'text-blue-600 bg-blue-100'
    },
    'pending_receipt': {
      label: '待收货',
      variant: 'default',
      icon: Truck,
      color: 'text-green-600 bg-green-100'
    },
    'completed': {
      label: '已完成',
      variant: 'success',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    },
    'cancelled': {
      label: '已取消',
      variant: 'destructive',
      icon: XCircle,
      color: 'text-gray-600 bg-gray-100'
    },
    'refund_processing': {
      label: '退款中',
      variant: 'default',
      icon: RotateCcw,
      color: 'text-yellow-600 bg-yellow-100'
    },
    'refund_completed': {
      label: '退款完成',
      variant: 'success',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    }
  };
  const config = statusConfig[status] || statusConfig.pending_payment;
  const Icon = config.icon;
  return <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>;
};

// 售后状态标签
const AfterSaleStatusBadge = ({
  afterSaleStatus
}) => {
  if (!afterSaleStatus) return null;
  const statusConfig = {
    'processing': {
      label: '售后中',
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    'completed': {
      label: '售后完成',
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    'rejected': {
      label: '售后拒绝',
      color: 'bg-red-100 text-red-700 border-red-200'
    }
  };
  const config = statusConfig[afterSaleStatus] || statusConfig.processing;
  return <Badge variant="outline" className={`${config.color} mt-1`}>
      <MessageSquare className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>;
};

// 订单卡片组件
const OrderCard = ({
  order,
  onOrderClick,
  onAfterSaleClick
}) => {
  const totalAmount = order.final_amount || order.total_amount;
  const canAfterSale = order.status === 'pending_receipt' || order.status === 'completed';
  const hasActiveAfterSale = order.after_sale_status === 'processing';
  return <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => onOrderClick(order)}>
      <CardContent className="p-0">
        {/* 订单头部 */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">订单号:</span>
              <span className="text-sm font-mono">{order.order_number}</span>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          {order.after_sale_status && <div className="mt-2">
              <AfterSaleStatusBadge afterSaleStatus={order.after_sale_status} />
            </div>}
        </div>

        {/* 商品列表 */}
        <div className="p-4">
          {order.items && order.items.map((item, index) => <OrderItem key={index} item={item} />)}
        </div>

        {/* 订单底部 */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">共{order.items?.length || 0}件商品</span>
            <div className="text-right">
              <span className="text-sm text-gray-600">实付: </span>
              <span className="text-lg font-bold text-red-600">¥{totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          {/* 操作按钮区域 */}
          <div className="grid grid-cols-2 gap-2">
            {/* 主要操作按钮 */}
            {order.status === 'pending_payment' && <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={e => {
            e.stopPropagation();
            // 立即付款逻辑
          }}>
                立即付款
              </Button>}
            
            {order.status === 'pending_shipment' && <Button variant="outline" size="sm" className="w-full" onClick={e => {
            e.stopPropagation();
            // 提醒发货
          }}>
                提醒发货
              </Button>}
            
            {order.status === 'pending_receipt' && <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={e => {
            e.stopPropagation();
            // 确认收货
          }}>
                确认收货
              </Button>}
            
            {order.status === 'completed' && <Button variant="outline" size="sm" className="w-full" onClick={e => {
            e.stopPropagation();
            // 评价
          }}>
                评价
              </Button>}

            {/* 查看详情按钮 */}
            <Button variant="outline" size="sm" className="w-full" onClick={e => {
            e.stopPropagation();
            onOrderClick(order);
          }}>
              查看详情
            </Button>
          </div>

          {/* 售后进度按钮 */}
          {canAfterSale && <div className="mt-3">
              <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200" onClick={e => {
            e.stopPropagation();
            onAfterSaleClick(order);
          }}>
                <MessageSquare className="w-4 h-4 mr-2" />
                {hasActiveAfterSale ? '查看售后进度' : '申请售后'}
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>}
        </div>
      </CardContent>
    </Card>;
};

// 空订单提示组件
const EmptyOrders = ({
  activeTab
}) => {
  const messages = {
    'all': '暂无订单记录',
    'pending_payment': '暂无待付款订单',
    'pending_shipment': '暂无待发货订单',
    'pending_receipt': '暂无待收货订单',
    'completed': '暂无已完成订单',
    'cancelled': '暂无已取消订单',
    'refund_processing': '暂无退款中订单',
    'refund_completed': '暂无退款完成订单'
  };
  return <div className="flex flex-col items-center justify-center py-12">
      <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
      <p className="text-gray-500">{messages[activeTab] || '暂无订单'}</p>
    </div>;
};
export default function Order(props) {
  const {
    $w
  } = props;
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();

  // 获取当前用户ID
  const getCurrentUserId = () => {
    const currentUser = $w.auth.currentUser;
    return currentUser ? currentUser.userId : null;
  };

  // 加载订单数据
  const loadOrders = async () => {
    try {
      setLoading(true);
      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        toast({
          title: '请先登录',
          description: '需要登录后才能查看订单',
          variant: 'destructive'
        });
        setOrders([]);
        return;
      }

      // 构建查询条件
      let filterWhere = {
        user_id: {
          $eq: currentUserId
        }
      };

      // 根据标签添加状态筛选
      if (activeTab !== 'all') {
        filterWhere.status = {
          $eq: activeTab
        };
      }
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'orders',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: filterWhere
          },
          select: {
            $master: true
          },
          orderBy: [{
            createdAt: 'desc'
          }],
          pageSize: 20,
          pageNumber: 1
        }
      });
      if (result && result.records) {
        setOrders(result.records);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('加载订单失败:', error);
      toast({
        title: '加载失败',
        description: `获取订单数据失败: ${error.message || '请重试'}`,
        variant: 'destructive'
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // 过滤订单
  const filteredOrders = orders;

  // 加载数据
  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  // 处理订单点击
  const handleOrderClick = order => {
    $w.utils.navigateTo({
      pageId: 'orderDetail',
      params: {
        orderId: order._id
      }
    });
  };

  // 处理售后点击
  const handleAfterSaleClick = order => {
    $w.utils.navigateTo({
      pageId: 'afterSale',
      params: {
        orderId: order._id,
        hasAfterSale: order.after_sale_status === 'processing'
      }
    });
  };

  // 处理标签切换
  const handleTabChange = tab => {
    setActiveTab(tab);
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm sticky top-0 z-10 p-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => $w.utils.navigateBack()} className="p-0">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 text-center">我的订单</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部标题 */}
      <div className="bg-white shadow-sm sticky top-0 z-10 p-4 flex items-center">
        <Button variant="ghost" size="sm" onClick={() => $w.utils.navigateBack()} className="p-0">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center">我的订单</h1>
      </div>

      {/* 订单状态标签 */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white">
          <TabsTrigger value="all" className="text-sm">全部</TabsTrigger>
          <TabsTrigger value="pending_payment" className="text-sm">待付款</TabsTrigger>
          <TabsTrigger value="pending_shipment" className="text-sm">待发货</TabsTrigger>
          <TabsTrigger value="pending_receipt" className="text-sm">待收货</TabsTrigger>
          <TabsTrigger value="completed" className="text-sm">已完成</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 订单列表 */}
      <div className="p-4 pb-24">
        {filteredOrders.length === 0 ? <EmptyOrders activeTab={activeTab} /> : <div>
            {filteredOrders.map(order => <OrderCard key={order._id} order={order} onOrderClick={handleOrderClick} onAfterSaleClick={handleAfterSaleClick} />)}
          </div>}
      </div>
    </div>;
}