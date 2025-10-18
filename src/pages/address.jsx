// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, Button, useToast, Badge, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui';
// @ts-ignore;
import { ChevronLeft, MapPin, User, Phone, Plus, Check, Trash2, Edit3, Star } from 'lucide-react';

// @ts-ignore;
import { TabBar } from '@/components/TabBar';

// 地址卡片组件
const AddressCard = ({
  address,
  onSelect,
  isSelected,
  onEdit,
  onDelete,
  onSetDefault,
  selectMode
}) => {
  return <Card className={`mb-3 ${isSelected ? 'border-green-500 border-2' : ''} ${address.is_default ? 'border-blue-500' : ''} ${selectMode ? 'cursor-pointer' : ''}`} onClick={() => selectMode && onSelect && onSelect(address)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <User className="w-4 h-4 text-gray-600 mr-2" />
              <span className="font-medium">{address.name}</span>
              <span className="ml-2 text-gray-500">{address.phone}</span>
              {address.is_default && <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">默认</Badge>}
            </div>
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                {address.province} {address.city} {address.district} {address.address}
              </p>
            </div>
          </div>
          {isSelected && <Check className="w-5 h-5 text-green-600 ml-2" />}
          {selectMode && !isSelected && <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180 ml-2" />}
        </div>
        
        {/* 操作按钮 - 选择模式下隐藏 */}
        {!selectMode && <div className="flex justify-end mt-3 pt-3 border-t space-x-2">
            {!address.is_default && <Button variant="ghost" size="sm" className="text-blue-600" onClick={e => {
          e.stopPropagation();
          onSetDefault(address);
        }}>
                <Star className="w-3 h-3 mr-1" />
                设为默认
              </Button>}
            <Button variant="ghost" size="sm" className="text-green-600" onClick={e => {
          e.stopPropagation();
          onEdit(address);
        }}>
              <Edit3 className="w-3 h-3 mr-1" />
              编辑
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600" onClick={e => {
          e.stopPropagation();
          onDelete(address);
        }}>
              <Trash2 className="w-3 h-3 mr-1" />
              删除
            </Button>
          </div>}
      </CardContent>
    </Card>;
};

// 空地址提示组件
const EmptyAddress = ({
  onAddAddress,
  selectMode
}) => {
  return <div className="flex flex-col items-center justify-center py-12">
      <MapPin className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-600 mb-2">
        {selectMode ? '请选择收货地址' : '暂无收货地址'}
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        {selectMode ? '请先添加或选择收货地址' : '请先添加收货地址'}
      </p>
      <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={onAddAddress}>
        <Plus className="w-4 h-4 mr-2" />
        新增收货地址
      </Button>
    </div>;
};
export default function Address(props) {
  const {
    $w
  } = props;
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [selectMode, setSelectMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteAddress, setDeleteAddress] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const {
    toast
  } = useToast();

  // 获取当前用户ID
  const getCurrentUserId = () => {
    const currentUser = $w.auth.currentUser;
    return currentUser ? currentUser.userId : null;
  };

  // 加载地址列表
  const loadAddresses = async () => {
    try {
      setLoading(true);
      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        toast({
          title: '请先登录',
          description: '需要登录后才能查看地址',
          variant: 'destructive'
        });
        setAddresses([]);
        return;
      }
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
          orderBy: [{
            is_default: 'desc'
          }, {
            createdAt: 'desc'
          }],
          select: {
            $master: true
          }
        }
      });
      setAddresses(result.records || []);

      // 如果是选择模式，检查是否有已选择的地址
      if (selectMode) {
        const params = $w.page.dataset.params;
        if (params && params.selectedAddressId) {
          setSelectedAddressId(params.selectedAddressId);
        }
      }
    } catch (error) {
      console.error('加载地址失败:', error);
      toast({
        title: '加载失败',
        description: `获取地址列表失败: ${error.message || '请重试'}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    // 检查是否是从 checkout 页面来的
    const params = $w.page.dataset.params;
    if (params && params.selectMode === 'true') {
      setSelectMode(true);
    }
    loadAddresses();
  }, []);

  // 监听页面返回，重新加载数据
  useEffect(() => {
    const handlePageShow = () => {
      loadAddresses();
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);
  const handleBack = () => {
    if (selectMode) {
      // 选择模式下返回时不带参数
      $w.utils.navigateBack();
    } else {
      $w.utils.navigateBack();
    }
  };
  const handleAddAddress = () => {
    $w.utils.navigateTo({
      pageId: 'addressForm',
      params: {
        from: selectMode ? 'checkout' : 'address',
        selectMode: selectMode.toString()
      }
    });
  };
  const handleEditAddress = address => {
    $w.utils.navigateTo({
      pageId: 'addressForm',
      params: {
        address: JSON.stringify(address),
        from: selectMode ? 'checkout' : 'address',
        selectMode: selectMode.toString()
      }
    });
  };
  const handleSelectAddress = address => {
    if (selectMode) {
      // 返回 checkout 页面并带回地址信息
      const addressInfo = {
        id: address._id,
        name: address.name,
        phone: address.phone,
        address: `${address.province} ${address.city} ${address.district} ${address.address}`,
        province: address.province,
        city: address.city,
        district: address.district,
        detail: address.address,
        isDefault: address.is_default
      };
      $w.utils.navigateBack({
        params: {
          selectedAddress: JSON.stringify(addressInfo),
          selectedAddressId: address._id
        }
      });
    }
  };
  const handleDeleteAddress = address => {
    setDeleteAddress(address);
  };
  const confirmDelete = async () => {
    if (!deleteAddress) return;
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'user_address',
        methodName: 'wedaDeleteV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: deleteAddress._id
              }
            }
          }
        }
      });
      toast({
        title: '删除成功',
        description: '地址已删除',
        variant: 'success'
      });

      // 重新加载地址列表
      loadAddresses();
    } catch (error) {
      console.error('删除地址失败:', error);
      toast({
        title: '删除失败',
        description: `删除地址失败: ${error.message || '请重试'}`,
        variant: 'destructive'
      });
    } finally {
      setDeleteAddress(null);
    }
  };
  const handleSetDefault = async address => {
    try {
      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        toast({
          title: '请先登录',
          description: '需要登录后才能设置默认地址',
          variant: 'destructive'
        });
        return;
      }

      // 先将所有地址设为非默认
      await $w.cloud.callDataSource({
        dataSourceName: 'user_address',
        methodName: 'wedaBatchUpdateV2',
        params: {
          data: {
            is_default: false
          },
          filter: {
            where: {
              user_id: {
                $eq: currentUserId
              }
            }
          }
        }
      });

      // 设置当前地址为默认
      await $w.cloud.callDataSource({
        dataSourceName: 'user_address',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            is_default: true
          },
          filter: {
            where: {
              _id: {
                $eq: address._id
              }
            }
          }
        }
      });
      toast({
        title: '设置成功',
        description: '已设为默认地址',
        variant: 'success'
      });

      // 重新加载地址列表
      loadAddresses();
    } catch (error) {
      console.error('设置默认地址失败:', error);
      toast({
        title: '设置失败',
        description: `设置默认地址失败: ${error.message || '请重试'}`,
        variant: 'destructive'
      });
    }
  };
  const handleTabChange = tabId => {
    setActiveTab(tabId);
    const pageMap = {
      home: 'home',
      'order-new': 'order-new',
      cart: 'cart',
      profile: 'profile'
    };
    if (tabId !== 'address') {
      $w.utils.navigateTo({
        pageId: pageMap[tabId]
      });
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 text-center">
            {selectMode ? '选择收货地址' : '管理收货地址'}
          </h1>
          <div className="w-10"></div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">加载中...</div>
      </div>
    </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 text-center">
            {selectMode ? '选择收货地址' : '管理收货地址'}
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* 地址列表 */}
      <div className="p-4 pb-24">
        {addresses.length === 0 ? <EmptyAddress onAddAddress={handleAddAddress} selectMode={selectMode} /> : <div>
            {addresses.map(address => <AddressCard key={address._id} address={address} onSelect={selectMode ? handleSelectAddress : null} isSelected={selectMode && selectedAddressId === address._id} onEdit={!selectMode ? handleEditAddress : null} onDelete={!selectMode ? handleDeleteAddress : null} onSetDefault={!selectMode ? handleSetDefault : null} selectMode={selectMode} />)}
          </div>}
      </div>

      {/* 底部新增地址按钮 - 选择模式下隐藏 */}
      {!selectMode && <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleAddAddress}>
          <Plus className="w-4 h-4 mr-2" />
          新增收货地址
        </Button>
      </div>}

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteAddress} onOpenChange={() => setDeleteAddress(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个收货地址吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!selectMode && <TabBar activeTab={activeTab} onTabChange={handleTabChange} />}
    </div>;
}