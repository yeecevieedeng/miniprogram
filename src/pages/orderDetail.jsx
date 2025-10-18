// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Avatar, AvatarImage, AvatarFallback, useToast } from '@/components/ui';
// @ts-ignore;
import { ChevronLeft, Truck, MapPin, CreditCard, Calendar, User, ShoppingBag, Package, CheckCircle, Clock, AlertCircle, XCircle, RotateCcw, DollarSign } from 'lucide-react';

export default function OrderDetail(props) {
  const {
    $w
  } = props;
  const orderId = props.$w.page.dataset.params.orderId;
  const {
    toast
  } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 获取当前用户ID
  const getCurrentUserId = () => {
    const currentUser = $w.auth.currentUser;
    return currentUser ? currentUser.userId : 'user_001';
  };

  // 加载订单详情
  const loadOrderDetail = async () => {
    try {
      const currentUserId = getCurrentUserId();
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'orders',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: orderId
              },
              user_id: {
                $eq: currentUserId
              }
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (result) {
        setOrder(result);
      } else {
        toast({
          title: '订单不存在',
          description: '未找到对应的订单信息',
          variant: 'destructive'
        });
        setTimeout(() => {
          $w.utils.navigateBack();
        }, 1500);
      }
    } catch (error) {
      console.error('加载订单详情失败:', error);
      toast({
        title: '加载失败',
        description: `获取订单信息失败: ${error.message || '请检查网络连接'}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 确认收货
  const handleConfirmReceipt = async () => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'orders',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: 'completed'
          },
          filter: {
            where: {
              _id: {
                $eq: orderId
              }
            }
          }
        }
      });
      toast({
        title: '确认收货成功',
        description: '订单已完成',
        variant: 'success'
      });

      // 重新加载订单数据
      loadOrderDetail();
    } catch (error) {
      console.error('确认收货失败:', error);
      toast({
        title: '操作失败',
        description: `确认收货失败: ${error.message || '请重试'}`,
        variant: 'destructive'
      });
    }
  };

  // 取消订单
  const handleCancelOrder = async () => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'orders',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: 'cancelled'
          },
          filter: {
            where: {
              _id: {
                $eq: orderId
              }
            }
          }
        }
      });
      toast({
        title: '订单已取消',
        description: '订单取消成功',
        variant: 'success'
      });

      // 重新加载订单数据
      loadOrderDetail();
    } catch (error) {
      console.error('取消订单失败:', error);
      toast({
        title: '操作失败',
        description: `取消订单失败: ${error.message || '请重试'}`,
        variant: 'destructive'
      });
    }
  };

  // 申请售后
  const handleApplyAfterSale = () => {
    $w.utils.navigateTo({
      pageId: 'afterSale',
      params: {
        orderId: orderId
      }
    });
  };

  // 查看物流
  const handleViewLogistics = () => {
    toast({
      title: '查看物流',
      description: '正在跳转到物流详情页面',
      variant: 'default'
    });
  };

  // 复制订单号
  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order?.order_number || '');
    toast({
      title: '已复制',
      description: '订单号已复制到剪贴板',
      variant: 'default'
    });
  };

  // 微信支付
  const handleWechatPay = async () => {
    try {
      // 模拟微信支付流程
      toast({
        title: '微信支付',
        description: '正在调起微信支付...',
        variant: 'default'
      });

      // 更新订单支付方式为微信支付
      const updateResult = await $w.cloud.callDataSource({
        dataSourceName: 'orders',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            payment_method: 'wechat',
            pay_time: new Date().getTime(),
            // 使用时间戳格式
            status: 'pending_shipment'
          },
          filter: {
            where: {
              _id: {
                $eq: orderId
              }
            }
          }
        }
      });
      if (updateResult && updateResult.count === 1) {
        // 模拟支付成功
        setTimeout(() => {
          toast({
            title: '支付成功',
            description: '微信支付已完成',
            variant: 'success'
          });

          // 重新加载订单数据
          loadOrderDetail();
        }, 2000);
      } else {
        throw new Error('更新订单状态失败');
      }
    } catch (error) {
      console.error('微信支付失败:', error);
      toast({
        title: '支付失败',
        description: `微信支付失败: ${error.message || '请重试'}`,
        variant: 'destructive'
      });
    }
  };
  useEffect(() => {
    if (orderId) {
      loadOrderDetail();
    } else {
      toast({
        title: '参数错误',
        description: '订单ID不存在',
        variant: 'destructive'
      });
      setTimeout(() => {
        $w.utils.navigateBack();
      }, 1500);
    }
  }, [orderId]);
  if (loading) {
    return <div className="min-h-screen bg-gray-50">
          <div className="bg-white shadow-sm">
            <div className="p-4 flex items-center">
              <Button variant="ghost" size="sm" onClick={() => $w.utils.navigateBack()}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold ml-2">订单详情</h1>
            </div>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">加载中...</div>
          </div>
        </div>;
  }
  if (!order) {
    return <div className="min-h-screen bg-gray-50">
          <div className="bg-white shadow-sm">
            <div className="p-4 flex items-center">
              <Button variant="ghost" size="sm" onClick={() => $w.utils.navigateBack()}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold ml-2">订单详情</h1>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center">订单不存在或已被删除</p>
            <Button className="mt-4" onClick={() => $w.utils.navigateBack()}>
              返回上一页
            </Button>
          </div>
        </div>;
  }
  const getStatusBadge = status => {
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
    const config = statusConfig[status] || {
      label: status,
      variant: 'default',
      icon: Package,
      color: 'text-gray-600 bg-gray-100'
    };
    const IconComponent = config.icon;
    return <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
          <IconComponent className="w-3 h-3" />
          {config.label}
        </Badge>;
  };
  return <div className="min-h-screen bg-gray-50 pb-24">
        {/* 顶部标题栏 */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="p-4 flex items-center">
            <Button variant="ghost" size="sm" onClick={() => $w.utils.navigateBack()}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold ml-2">订单详情</h1>
            <div className="flex-1" />
            {getStatusBadge(order.status)}
          </div>
        </div>

        {/* 物流状态卡片 - 仅显示在已发货状态 */}
        {(order.status === 'pending_receipt' || order.status === 'completed') && <Card className="m-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium">物流信息</span>
                </div>
                <Badge variant="outline" className="text-blue-600">
                  运输中
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">快递公司</span>
                  <span>{order.logistics_info?.company || '顺丰速运'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">运单号</span>
                  <span className="font-mono">{order.logistics_info?.tracking_number || 'SF1234567890'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">预计送达</span>
                  <span>{order.logistics_info?.estimated_delivery || '2024-12-05 18:00前'}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-3" onClick={handleViewLogistics}>
                <MapPin className="w-4 h-4 mr-2" />
                查看完整物流
              </Button>
            </CardContent>
          </Card>}

        {/* 商品信息卡片 - 移除商家店铺信息，保持和结算页面一致的设计 */}
        <Card className="m-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <ShoppingBag className="w-4 h-4 mr-2" />
              商品信息 ({order.items?.length || 0}件)
            </h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => <div key={index} className="flex py-3 border-b last:border-b-0">
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
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* 订单信息卡片 */}
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-base">订单信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 收货地址 */}
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <User className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{order.shipping_address?.name} {order.shipping_address?.phone}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.shipping_address?.province} {order.shipping_address?.city} {order.shipping_address?.district} {order.shipping_address?.address}
                  </p>
                </div>
              </div>
            </div>

            {/* 订单时间信息 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">下单时间</span>
                </div>
                <span className="text-sm">{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              
              {order.pay_time && <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">支付时间</span>
                  </div>
                  <span className="text-sm">{new Date(order.pay_time).toLocaleString()}</span>
                </div>}
              
              {order.ship_time && <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">发货时间</span>
                  </div>
                  <span className="text-sm">{new Date(order.ship_time).toLocaleString()}</span>
                </div>}
              
              {order.complete_time && <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">完成时间</span>
                  </div>
                  <span className="text-sm">{new Date(order.complete_time).toLocaleString()}</span>
                </div>}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">支付方式</span>
                </div>
                <span className="text-sm">微信支付</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">订单编号</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-mono mr-2">{order.order_number}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyOrderNumber}>
                    复制
                  </Button>
                </div>
              </div>
            </div>

            {/* 订单备注 */}
            {order.note && <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">买家备注：</p>
                <p className="text-sm mt-1">{order.note}</p>
              </div>}
          </CardContent>
        </Card>

        {/* 金额明细卡片 */}
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-base">金额明细</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">商品金额</span>
              <span>¥{order.total_amount}</span>
            </div>
            
            {order.discount_amount > 0 && <div className="flex justify-between text-sm">
                <span className="text-gray-600">优惠金额</span>
                <span className="text-red-600">-¥{order.discount_amount}</span>
              </div>}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">运费</span>
              <span>{order.shipping_fee === 0 ? '免运费' : `¥${order.shipping_fee}`}</span>
            </div>
            
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>实付金额</span>
              <span className="text-red-600">¥{order.final_amount}</span>
            </div>
          </CardContent>
        </Card>

        {/* 底部操作栏 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="flex gap-3 max-w-md mx-auto">
            {/* 待付款状态 */}
            {order.status === 'pending_payment' && <>
                <Button variant="outline" className="flex-1" onClick={handleCancelOrder}>
                  <XCircle className="w-4 h-4 mr-2" />
                  取消订单
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleWechatPay}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  微信支付
                </Button>
              </>}
            
            {/* 待发货状态 */}
            {order.status === 'pending_shipment' && <Button variant="outline" className="flex-1" onClick={handleCancelOrder}>
                <XCircle className="w-4 h-4 mr-2" />
                取消订单
              </Button>}
            
            {/* 待收货状态 */}
            {order.status === 'pending_receipt' && <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleConfirmReceipt}>
                <CheckCircle className="w-4 h-4 mr-2" />
                确认收货
              </Button>}
            
            {/* 已完成状态 */}
            {order.status === 'completed' && <Button variant="outline" className="flex-1" onClick={handleApplyAfterSale}>
                <RotateCcw className="w-4 h-4 mr-2" />
                申请售后
              </Button>}
            
            {/* 退款中状态 */}
            {order.status === 'refund_processing' && <Button variant="outline" className="flex-1" onClick={() => $w.utils.navigateTo({
          pageId: 'afterSaleDetail',
          params: {
            orderId: orderId
          }
        })}>
                <RotateCcw className="w-4 h-4 mr-2" />
                查看售后进度
              </Button>}
          </div>
        </div>
      </div>;
}