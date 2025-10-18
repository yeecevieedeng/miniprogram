// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Trash2, Minus, Plus } from 'lucide-react';
// @ts-ignore;
import { Button, useToast } from '@/components/ui';

export default function Cart(props) {
  const {
    $w,
    style
  } = props;
  const {
    toast
  } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAll, setSelectedAll] = useState(false);

  // 加载购物车数据
  const loadCartData = async () => {
    try {
      setLoading(true);
      const currentUser = $w.auth.currentUser;
      if (!currentUser) {
        $w.utils.navigateTo({
          pageId: 'profile'
        });
        return;
      }
      const cartResult = await $w.cloud.callDataSource({
        dataSourceName: 'cart',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              userId: {
                $eq: currentUser.userId
              }
            }
          },
          select: {
            $master: true
          }
        }
      });
      const items = cartResult.records || [];
      setCartItems(items);
      if (items.length > 0) {
        const productIds = items.map(item => item.productId);
        const productResult = await $w.cloud.callDataSource({
          dataSourceName: 'product',
          methodName: 'wedaGetRecordsV2',
          params: {
            filter: {
              where: {
                _id: {
                  $in: productIds
                }
              }
            },
            select: {
              $master: true
            }
          }
        });
        const productMap = {};
        productResult.records.forEach(product => {
          productMap[product._id] = {
            ...product,
            image: product.images?.[0] || 'https://via.placeholder.com/80'
          };
        });
        setProducts(productMap);
      }
    } catch (error) {
      console.error('加载购物车失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 更新商品数量
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'cart',
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: itemId
              }
            }
          },
          data: {
            quantity: newQuantity
          }
        }
      });
      setCartItems(prev => prev.map(item => item._id === itemId ? {
        ...item,
        quantity: newQuantity
      } : item));
    } catch (error) {
      console.error('更新数量失败:', error);
    }
  };

  // 删除单个商品
  const deleteItem = async itemId => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'cart',
        methodName: 'wedaDeleteV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: itemId
              }
            }
          }
        }
      });
      setCartItems(prev => prev.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('删除商品失败:', error);
    }
  };

  // 批量删除选中商品
  const deleteSelectedItems = async () => {
    try {
      const selectedItems = cartItems.filter(item => item.selected);
      if (selectedItems.length === 0) {
        toast({
          title: '提示',
          description: '请先选择要删除的商品'
        });
        return;
      }
      await $w.cloud.callDataSource({
        dataSourceName: 'cart',
        methodName: 'wedaBatchDeleteV2',
        params: {
          filter: {
            where: {
              _id: {
                $in: selectedItems.map(item => item._id)
              }
            }
          }
        }
      });
      setCartItems(prev => prev.filter(item => !item.selected));
      toast({
        title: '成功',
        description: `已删除${selectedItems.length}件商品`
      });
    } catch (error) {
      console.error('批量删除失败:', error);
      toast({
        title: '错误',
        description: '删除商品失败'
      });
    }
  };

  // 切换选中状态
  const toggleSelect = async (itemId, selected) => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'cart',
        methodName: 'wedaUpdateV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: itemId
              }
            }
          },
          data: {
            selected
          }
        }
      });
      setCartItems(prev => prev.map(item => item._id === itemId ? {
        ...item,
        selected
      } : item));
    } catch (error) {
      console.error('更新选中状态失败:', error);
    }
  };

  // 全选/取消全选
  const toggleSelectAll = async () => {
    const newSelected = !selectedAll;
    setSelectedAll(newSelected);
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'cart',
        methodName: 'wedaBatchUpdateV2',
        params: {
          filter: {
            where: {
              userId: {
                $eq: $w.auth.currentUser.userId
              }
            }
          },
          data: {
            selected: newSelected
          }
        }
      });
      setCartItems(prev => prev.map(item => ({
        ...item,
        selected: newSelected
      })));
    } catch (error) {
      console.error('全选失败:', error);
    }
  };

  // 计算总价
  const calculateTotal = () => cartItems.reduce((total, item) => {
    if (item.selected && products[item.productId]) {
      return total + products[item.productId].origin_price * item.quantity;
    }
    return total;
  }, 0);

  // 获取选中商品数量
  const getSelectedCount = () => cartItems.filter(item => item.selected).length;

  // 去结算
  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      toast({
        title: '提示',
        description: '请先选择要结算的商品'
      });
      return;
    }
    $w.utils.navigateTo({
      pageId: 'checkout',
      params: {
        fromCart: true,
        selectedItems: JSON.stringify(selectedItems.map(item => ({
          ...item,
          product: products[item.productId]
        })))
      }
    });
  };
  useEffect(() => {
    loadCartData();
  }, []);
  useEffect(() => {
    if (cartItems.length > 0) {
      const allSelected = cartItems.every(item => item.selected);
      setSelectedAll(allSelected);
    }
  }, [cartItems]);
  if (loading) {
    return <div style={style} className="min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg p-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>)}
          </div>
        </div>
      </div>;
  }
  return <div style={style} className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10 p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="p-0" onClick={() => $w.utils.navigateBack()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">购物车</h1>
        </div>
      </div>

      {cartItems.length === 0 ? <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-lg font-medium text-gray-600 mb-2">购物车空空如也</h2>
          <p className="text-gray-400 text-sm mb-6">快去添加喜欢的商品吧</p>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => $w.utils.navigateTo({
        pageId: 'order-new'
      })}>
            去购物
          </Button>
        </div> : <div className="p-4 space-y-3">
          <div className="bg-white rounded-lg p-3 shadow-sm flex justify-between items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={selectedAll} onChange={toggleSelectAll} className="w-4 h-4 text-blue-500 rounded" />
              <span className="text-sm text-gray-600">全选</span>
            </label>
            <Button variant="ghost" size="sm" className="text-red-500" onClick={deleteSelectedItems}>
              <Trash2 className="w-4 h-4 mr-1" />
              删除选中
            </Button>
          </div>

          {cartItems.map(item => {
        const product = products[item.productId];
        if (!product) return null;
        return <div key={item._id} className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-start space-x-3">
                  <label className="flex items-start space-x-3 flex-1">
                    <input type="checkbox" checked={item.selected} onChange={e => toggleSelect(item._id, e.target.checked)} className="w-4 h-4 text-blue-500 rounded mt-1" />
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
                      {item.specification && <p className="text-xs text-gray-500 mb-1">规格: {item.specification}</p>}
                      <p className="text-red-500 font-semibold text-sm">¥{product.origin_price?.toFixed(2)}</p>
                    </div>
                  </label>

                  <div className="flex flex-col items-end space-y-2">
                    <Button variant="ghost" size="sm" className="p-0 text-gray-400 hover:text-red-500" onClick={() => deleteItem(item._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-2 py-1">
                      <Button variant="ghost" size="sm" className="p-0 h-6 w-6" onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <Button variant="ghost" size="sm" className="p-0 h-6 w-6" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>;
      })}
        </div>}

      {cartItems.length > 0 && <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                合计: <span className="text-red-500 font-semibold text-lg">¥{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-400">已选 {getSelectedCount()} 件商品</div>
            </div>
            <Button className="bg-red-500 hover:bg-red-600 text-white px-6" onClick={handleCheckout}>
              去结算
            </Button>
          </div>
        </div>}
    </div>;
}