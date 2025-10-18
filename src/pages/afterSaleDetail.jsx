// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, Badge, Button, Timeline, TimelineItem, TimelineDot, TimelineContent, TimelineSeparator, TimelineConnector, useToast } from '@/components/ui';
// @ts-ignore;
import { ChevronLeft, Package, MessageCircle, Clock, CheckCircle, XCircle, RotateCcw, Truck, Phone } from 'lucide-react';

// 售后状态配置
const afterSaleStatusConfig = {
  pending: {
    label: '待处理',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock
  },
  processing: {
    label: '处理中',
    color: 'bg-blue-100 text-blue-800',
    icon: RotateCcw
  },
  approved: {
    label: '已同意',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  rejected: {
    label: '已拒绝',
    color: 'bg-red-100 text-red-800',
    icon: XCircle
  },
  completed: {
    label: '已完成',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  cancelled: {
    label: '已取消',
    color: 'bg-gray-100 text-gray-800',
    icon: XCircle
  }
};

// 售后类型配置
const afterSaleTypeConfig = {
  refund: '仅退款',
  return_refund: '退货退款',
  exchange: '换货',
  repair: '维修'
};

// 售后状态标签组件
const AfterSaleStatusBadge = ({
  status
}) => {
  const config = afterSaleStatusConfig[status] || afterSaleStatusConfig.pending;
  const Icon = config.icon;
  return <Badge className={`${config.color} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>;
};

// 商品信息卡片
const ProductInfoCard = ({
  product
}) => {
  return <Card className="mb-4">
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">商品信息</h3>
        <div className="flex">
          <img src={product.image} alt={product.name} className="w-20 h-20 rounded-lg object-cover" />
          <div className="ml-3 flex-1">
            <h4 className="font-medium text-sm">{product.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{product.specification}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-red-600 font-medium">¥{product.price}</span>
              <span className="text-sm text-gray-500">x{product.quantity}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};

// 售后信息卡片
const AfterSaleInfoCard = ({
  afterSale
}) => {
  return <Card className="mb-4">
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">售后信息</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">售后类型</span>
            <span className="text-sm font-medium">{afterSaleTypeConfig[afterSale.type]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">申请原因</span>
            <span className="text-sm">{afterSale.reason}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">退款金额</span>
            <span className="text-sm font-medium text-red-600">¥{afterSale.refundAmount}</span>
          </div>
          {afterSale.description && <div>
              <span className="text-sm text-gray-600">问题描述</span>
              <p className="text-sm mt-1 bg-gray-50 p-3 rounded">{afterSale.description}</p>
            </div>}
          {afterSale.images && afterSale.images.length > 0 && <div>
              <span className="text-sm text-gray-600">凭证图片</span>
              <div className="flex gap-2 mt-2">
                {afterSale.images.map((img, index) => <img key={index} src={img} alt={`凭证${index + 1}`} className="w-16 h-16 rounded object-cover" />)}
              </div>
            </div>}
        </div>
      </CardContent>
    </Card>;
};

// 进度时间线组件
const ProgressTimeline = ({
  progress
}) => {
  return <Card className="mb-4">
      <CardContent className="p-4">
        <h3 className="font-medium mb-4">处理进度</h3>
        <Timeline>
          {progress.map((item, index) => {
          const isLast = index === progress.length - 1;
          const Icon = item.icon || Clock;
          return <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot className={item.isActive ? 'bg-blue-600' : 'bg-gray-300'}>
                    <Icon className="w-4 h-4 text-white" />
                  </TimelineDot>
                  {!isLast && <TimelineConnector className={item.isActive ? 'bg-blue-600' : 'bg-gray-300'} />}
                </TimelineSeparator>
                <TimelineContent>
                  <div className={item.isActive ? 'text-gray-900' : 'text-gray-500'}>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs mt-1">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>
                </TimelineContent>
              </TimelineItem>;
        })}
        </Timeline>
      </CardContent>
    </Card>;
};
export default function AfterSaleDetail(props) {
  const {
    $w
  } = props;
  const [afterSale, setAfterSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();

  // 获取参数
  const orderId = $w.page.dataset.params?.orderId || '3';
  const hasAfterSale = $w.page.dataset.params?.hasAfterSale === 'true';

  // 加载售后详情
  const loadAfterSaleDetail = async () => {
    try {
      setLoading(true);

      // 模拟售后详情数据
      const mockAfterSale = {
        id: 'AS20240915001',
        orderId: orderId,
        type: 'return_refund',
        status: hasAfterSale ? 'processing' : 'pending',
        reason: '商品质量问题',
        description: '收到的商品有破损，影响使用，希望能够退货退款。',
        refundAmount: 11.0,
        images: hasAfterSale ? ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200'] : [],
        createTime: '2024-09-15 10:30',
        product: {
          id: '4',
          name: '新鲜菠菜',
          price: 5.5,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100',
          specification: '250g/份'
        },
        progress: hasAfterSale ? [{
          title: '提交申请',
          description: '您的售后申请已提交',
          time: '2024-09-15 10:30',
          icon: CheckCircle,
          isActive: true
        }, {
          title: '商家审核',
          description: '商家正在审核您的申请',
          time: '2024-09-15 11:00',
          icon: RotateCcw,
          isActive: true
        }, {
          title: '等待退货',
          description: '请按指引寄回商品',
          time: '待处理',
          icon: Truck,
          isActive: false
        }, {
          title: '退款处理',
          description: '收到退货后处理退款',
          time: '待处理',
          icon: CheckCircle,
          isActive: false
        }] : [{
          title: '提交申请',
          description: '您的售后申请已提交',
          time: '2024-09-15 10:30',
          icon: CheckCircle,
          isActive: true
        }]
      };
      setAfterSale(mockAfterSale);
    } catch (error) {
      console.error('加载售后详情失败:', error);
      toast({
        title: '加载失败',
        description: '获取售后详情失败，请重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 加载数据
  useEffect(() => {
    loadAfterSaleDetail();
  }, [orderId, hasAfterSale]);

  // 处理返回
  const handleBack = () => {
    $w.utils.navigateBack();
  };

  // 处理联系客服
  const handleContactService = () => {
    toast({
      title: '联系客服',
      description: '正在为您转接客服...',
      variant: 'default'
    });
  };

  // 处理取消申请
  const handleCancel = () => {
    toast({
      title: '取消申请',
      description: '售后申请已取消',
      variant: 'success'
    });
    setTimeout(() => {
      $w.utils.navigateBack();
    }, 1500);
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 text-center">售后详情</h1>
          <div className="w-10"></div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">加载中...</div>
      </div>
    </div>;
  }
  if (!afterSale) {
    return <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 text-center">售后详情</h1>
          <div className="w-10"></div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">售后信息不存在</div>
      </div>
    </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 text-center">售后详情</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-4">
        {/* 售后状态 */}
        <div className="mb-4">
          <AfterSaleStatusBadge status={afterSale.status} />
        </div>

        {/* 商品信息 */}
        <ProductInfoCard product={afterSale.product} />

        {/* 售后信息 */}
        <AfterSaleInfoCard afterSale={afterSale} />

        {/* 处理进度 */}
        <ProgressTimeline progress={afterSale.progress} />

        {/* 操作按钮 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleContactService}>
              <Phone className="w-4 h-4 mr-2" />
              联系客服
            </Button>
            {afterSale.status === 'pending' && <Button variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-50" onClick={handleCancel}>
                取消申请
              </Button>}
          </div>
        </div>
      </div>
    </div>;
}