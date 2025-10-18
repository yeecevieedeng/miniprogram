// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ChevronLeft, ShoppingBag, MapPin } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent, Button, Separator } from '@/components/ui';

// @ts-ignore;
import { AddressSelectorModal } from '@/components/AddressSelectorModal';
// @ts-ignore;
import { CheckoutItem } from '@/components/CheckoutItem';
// @ts-ignore;
import { FixedCheckoutBar } from '@/components/FixedCheckoutBar';
// @ts-ignore;
import { AddressDisplay } from '@/components/AddressDisplay';
export default function Checkout(props) {
  const {
    $w
  } = props;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(5);
  const getCurrentUserId = () => {
    const currentUser = $w.auth.currentUser;
    return currentUser ? currentUser.userId : 'user_001';
  };
  const generateOrderNumber = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    return `ORD${timestamp}${random}`;
  };

  // 加载收货地址
  const loadAddresses = async () => {
    try {
      const currentUserId = getCurrentUserId();
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'user_address',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              user_id: {
                $eq: currentUserId
              }
            }
          },
          select: {
            $master: true
          },
          orderBy: [{
            is_default: 'desc'
          }, {
            createdAt: 'desc'
          }]
        }
      });
      const addressList = result.records || [];
      setAddresses(addressList);
      const defaultAddress = addressList.find(addr => addr.is_default) || addressList[0];
      if (defaultAddress) setSelectedAddress(defaultAddress);
    } catch (error) {
      console.error('加载地址失败:', error);
    }
  };

  // 加载结算商品
  const loadCheckoutItems = async () => {
    try {
      const currentUserId = getCurrentUserId();
      const itemsParam = $w.page.dataset.params?.items;
      let items = [];
      if (itemsParam) {
        items = JSON.parse(itemsParam);
      } else {
        // 从购物车获取已选商品
        const cartResult = await $w.cloud.callDataSource({
          dataSourceName: 'cart',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                userId: {
                  $eq: currentUserId
                },
                selected: {
                  $eq: true
                }
              }
            },
            select: {
              $master: true
            }
          }
        });
        const cartItems = cartResult.records || [];
        if (cartItems.length === 0) {
          setCheckoutItems([]);
          setLoading(false);
          return;
        }
        items = await Promise.all(cartItems.map(async item => {
          try {
            const productResult = await $w.cloud.callDataSource({
              dataSourceName: 'product',
              methodName: 'wedaGetItemV2',
              params: {
                filter: {
                  where: {
                    _id: {
                      $eq: item.productId
                    }
                  }
                },
                select: {
                  $master: true
                }
              }
            });
            return {
              id: item._id,
              productId: item.productId,
              name: productResult.name || '商品名称',
              price: productResult.origin_price || 0,
              image: productResult.images?.[0] || 'https://via.placeholder.com/80',
              specification: item.specification || '默认规格',
              quantity: item.quantity || 1
            };
          } catch (error) {
            console.error('获取商品详情失败:', error);
            return {
              id: item._id,
              productId: item.productId,
              name: '商品信息获取失败',
              price: 0,
              image: 'https://via.placeholder.com/80',
              specification: item.specification || '默认规格',
              quantity: item.quantity || 1
            };
          }
        }));
      }
      setCheckoutItems(items);
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setDeliveryFee(totalAmount >= 50 ? 0 : 5);
    } catch (error) {
      console.error('加载购物车商品失败:', error);
    } finally {
      setLoading(false);
    }
  };
  const calculateTotal = () => checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handleSelectAddress = address => setSelectedAddress(address);
  const handleAddAddress = () => $w.utils.navigateTo({
    pageId: 'addressForm',
    params: {
      mode: 'add',
      returnTo: 'checkout'
    }
  });
  const handleEditAddress = address => $w.utils.navigateTo({
    pageId: 'addressForm',
    params: {
      mode: 'edit',
      addressId: address._id,
      returnTo: 'checkout'
    }
  });
  const handleSubmitOrder = async () => {
    if (!selectedAddress || checkoutItems.length === 0) return;
    try {
      const currentUserId = getCurrentUserId();
      const totalAmount = calculateTotal();
      const finalAmount = totalAmount + deliveryFee;
      const orderData = {
        order_number: generateOrderNumber(),
        user_id: currentUserId,
        status: 'pending_payment',
        total_amount: totalAmount,
        discount_amount: 0,
        shipping_fee: deliveryFee,
        final_amount: finalAmount,
        items: checkoutItems.map(item => ({
          product_id: item.productId,
          name: item.name,
          price: item.price,
          original_price: item.price,
          // 使用origin_price作为原价
          quantity: item.quantity,
          specification: item.specification,
          image: item.image // 统一使用image字段
        })),
        shipping_address: {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          province: selectedAddress.province,
          city: selectedAddress.city,
          district: selectedAddress.district,
          address: selectedAddress.address
        },
        note
      };
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'orders',
        methodName: 'wedaCreateV2',
        params: {
          data: orderData
        }
      });
      if (result && result.id) {
        // 清理购物车
        await Promise.all(checkoutItems.map(item => $w.cloud.callDataSource({
          dataSourceName: 'cart',
          methodName: 'wedaDeleteV2',
          params: {
            filter: {
              where: {
                _id: {
                  $eq: item.id
                }
              }
            }
          }
        })));
        setTimeout(() => {
          $w.utils.navigateTo({
            pageId: 'orderDetail',
            params: {
              orderId: result.id
            }
          });
        }, 1500);
      }
    } catch (error) {
      console.error('提交订单失败:', error);
    }
  };
  const handleBack = () => $w.utils.navigateBack();
  useEffect(() => {
    loadAddresses();
    loadCheckoutItems();
  }, []);
  const totalAmount = calculateTotal();
  const finalAmount = totalAmount + deliveryFee;
  if (loading) {
    return <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="p-4 flex items-center">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold flex-1 text-center">确认订单</h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-32">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 text-center">确认订单</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4">
        {/* 收货地址 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                收货地址
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddressModal(true)}>
                {selectedAddress ? '更换' : '选择地址'}
              </Button>
            </div>
            {selectedAddress ? <AddressDisplay address={selectedAddress} onOpenModal={() => setShowAddressModal(true)} onEditAddress={handleEditAddress} /> : <div className="text-center py-6 text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">请选择收货地址</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowAddressModal(true)}>
                  选择地址
                </Button>
              </div>}
          </CardContent>
        </Card>

        {/* 商品信息 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <ShoppingBag className="w-4 h-4 mr-2" />
              商品信息 ({checkoutItems.length}件)
            </h3>
            <div className="space-y-3">
              {checkoutItems.map(item => <CheckoutItem key={item.id} item={item} />)}
            </div>
          </CardContent>
        </Card>

        {/* 订单备注 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">订单备注</h3>
            <input type="text" placeholder="请输入订单备注（选填）" value={note} onChange={e => setNote(e.target.value)} className="w-full p-2 border rounded-lg text-sm" />
          </CardContent>
        </Card>

        {/* 费用明细 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">费用明细</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">商品金额</span>
                <span className="text-sm">¥{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">配送费</span>
                <span className="text-sm">
                  {deliveryFee === 0 ? '免运费' : `¥${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>总计</span>
                <span className="text-red-600">¥{finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 地址选择弹窗 */}
        <AddressSelectorModal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} addresses={addresses} selectedAddress={selectedAddress} onSelectAddress={handleSelectAddress} onAddAddress={handleAddAddress} onEditAddress={handleEditAddress} />
      </div>

      {/* 底部结算栏 */}
      <FixedCheckoutBar totalAmount={finalAmount} onSubmit={handleSubmitOrder} disabled={!selectedAddress || checkoutItems.length === 0} />
    </div>;
}