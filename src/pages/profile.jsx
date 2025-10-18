// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { User, ShoppingBag, MapPin, LogOut, ChevronRight, Info, LogIn, Phone, Mail, Calendar } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent, Avatar, AvatarImage, AvatarFallback, Button, useToast } from '@/components/ui';

// @ts-ignore;
import { TabBar } from '@/components/TabBar';
function ProfileHeader(props) {
  const {
    userData,
    wechatData,
    onEditProfile,
    onWechatLogin,
    isLoading,
    isLoggedIn
  } = props;
  const displayName = wechatData?.nickname || userData?.nickname || '未登录用户';
  const displayAvatar = wechatData?.avatar_url || userData?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100';
  const displayEmail = userData?.email;
  const memberSince = userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('zh-CN') : null;
  return <Card className="m-4 shadow-md rounded-xl border-0">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-20 h-20 border-2 border-white shadow-md">
            <AvatarImage src={displayAvatar} alt={displayName} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xl font-semibold">
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            {isLoading ? <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div> : isLoggedIn ? <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 truncate">{displayName}</h2>
                    {memberSince && <p className="text-xs text-gray-500 mt-1">会员自 {memberSince}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={onEditProfile} className="text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors px-3 py-1 text-sm">
                    编辑资料
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {userData?.phone && <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      <span className="truncate">{userData.phone}</span>
                    </div>}
                  
                  {displayEmail && <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                      <span className="truncate">{displayEmail}</span>
                    </div>}
                </div>
              </div> : <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">未登录</h2>
                <p className="text-sm text-gray-500">请登录以查看个人信息和享受会员权益</p>
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;
}
function OrderEntry(props) {
  const {
    isLoggedIn,
    onWechatLogin
  } = props;
  const [isPressed, setIsPressed] = useState(false);
  const handleClick = () => {
    if (!isLoggedIn) {
      onWechatLogin();
      return;
    }
    $w.utils.navigateTo({
      pageId: 'order'
    });
  };
  return <Card className={`m-4 cursor-pointer transition-all duration-200 rounded-xl border-0 ${isPressed ? 'scale-95 shadow-md' : 'hover:shadow-md'} shadow-sm`} onClick={handleClick} onMouseDown={() => setIsPressed(true)} onMouseUp={() => setIsPressed(false)} onMouseLeave={() => setIsPressed(false)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingBag className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <p className="text-base font-medium">我的订单</p>
              <p className="text-sm text-gray-500">{isLoggedIn ? '查看全部订单状态' : '登录后查看订单'}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </CardContent>
    </Card>;
}
function MenuItem({
  icon: Icon,
  title,
  subtitle,
  onClick,
  disabled = false,
  destructive = false
}) {
  const [isPressed, setIsPressed] = useState(false);
  return <div className={`flex items-center justify-between p-4 bg-white border-b cursor-pointer transition-all duration-200 ${isPressed ? 'bg-gray-100 scale-95' : 'hover:bg-gray-50'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${destructive ? 'text-red-600 hover:bg-red-50' : ''}`} onClick={!disabled ? onClick : undefined} onMouseDown={() => !disabled && setIsPressed(true)} onMouseUp={() => !disabled && setIsPressed(false)} onMouseLeave={() => !disabled && setIsPressed(false)}>
      <div className="flex items-center">
        <Icon className={`w-5 h-5 mr-3 ${destructive ? 'text-red-600' : 'text-gray-600'}`} />
        <div>
          <p className={`text-sm font-medium ${destructive ? 'text-red-600' : ''}`}>{title}</p>
          {subtitle && <p className={`text-xs ${destructive ? 'text-red-500' : 'text-gray-500'}`}>{subtitle}</p>}
        </div>
      </div>
      <ChevronRight className={`w-4 h-4 ${destructive ? 'text-red-400' : 'text-gray-400'}`} />
    </div>;
}
export default function Profile(props) {
  const {
    $w
  } = props;
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [wechatData, setWechatData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authState, setAuthState] = useState($w.auth.currentUser);
  const {
    toast
  } = useToast();

  // 正确的登录状态判断：直接检查系统认证模块
  const isLoggedIn = !!$w.auth.currentUser;
  const fetchUserData = async () => {
    try {
      const currentUser = $w.auth.currentUser;
      if (!currentUser) {
        setUserData(null);
        setWechatData(null);
        return;
      }
      setIsLoading(true);

      // 获取用户基础信息
      const userResponse = await $w.cloud.callDataSource({
        dataSourceName: 'user',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              wxUid: {
                $eq: currentUser.userId
              }
            }
          },
          select: {
            $master: true
          },
          pageSize: 1
        }
      });

      // 获取微信用户信息
      const wechatResponse = await $w.cloud.callDataSource({
        dataSourceName: 'wechat_user',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              wxUid: {
                $eq: currentUser.userId
              }
            }
          },
          select: {
            $master: true
          },
          pageSize: 1
        }
      });
      setUserData(userResponse.records?.[0] || null);
      setWechatData(wechatResponse.records?.[0] || null);
    } catch (error) {
      toast({
        title: '加载失败',
        description: error.message || '请重试',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 监听认证状态变化
  useEffect(() => {
    const checkAuthChange = () => {
      const currentAuthState = $w.auth.currentUser;
      if (currentAuthState?.userId !== authState?.userId) {
        setAuthState(currentAuthState);
        fetchUserData();
      }
    };

    // 设置定时器定期检查认证状态变化
    const authCheckInterval = setInterval(checkAuthChange, 1000);
    return () => clearInterval(authCheckInterval);
  }, [authState]);
  useEffect(() => {
    fetchUserData();
  }, []);

  // 监听页面参数变化（从get_user页面返回时触发）
  useEffect(() => {
    if ($w.page.dataset.params?.refresh) {
      fetchUserData();
    }
  }, [$w.page.dataset.params]);
  const handleWechatLogin = async () => {
    $w.utils.navigateTo({
      pageId: 'get_user'
    });
  };
  const handleTabChange = tabId => {
    setActiveTab(tabId);
    const pageMap = {
      home: 'home',
      'order-new': 'order-new',
      cart: 'cart',
      profile: 'profile'
    };
    if (tabId !== 'profile') {
      $w.utils.navigateTo({
        pageId: pageMap[tabId]
      });
    }
  };
  const handleEditProfile = () => {
    if (!isLoggedIn) {
      handleWechatLogin();
      return;
    }
    $w.utils.navigateTo({
      pageId: 'profileEdit'
    });
  };
  const handleManageAddress = () => {
    if (!isLoggedIn) {
      handleWechatLogin();
      return;
    }
    $w.utils.navigateTo({
      pageId: 'address'
    });
  };
  const handleAboutUs = () => {
    $w.utils.navigateTo({
      pageId: 'about'
    });
  };
  const handleLogout = async () => {
    if (confirm('确定要退出登录吗？退出后将无法查看个人订单和地址信息。')) {
      try {
        // 调用系统退出登录方法
        await $w.auth.signOut();
        setUserData(null);
        setWechatData(null);
        toast({
          title: '退出成功',
          description: '您已安全退出登录',
          variant: 'success'
        });
      } catch (error) {
        toast({
          title: '退出失败',
          description: error.message || '请重试',
          variant: 'destructive'
        });
      }
    }
  };
  const mainMenuItems = [{
    icon: MapPin,
    title: '收货地址',
    subtitle: '管理收货地址',
    onClick: handleManageAddress,
    disabled: !isLoggedIn
  }, {
    icon: Info,
    title: '关于我们',
    subtitle: '了解和屿食补',
    onClick: handleAboutUs
  }];
  const authMenuItems = isLoggedIn ? [{
    icon: LogOut,
    title: '退出登录',
    subtitle: '安全退出当前账号',
    onClick: handleLogout,
    destructive: true
  }] : [{
    icon: LogIn,
    title: '微信登录',
    subtitle: '使用微信账号登录',
    onClick: handleWechatLogin
  }];
  return <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="p-4">
          <h1 className="text-lg font-semibold text-center">个人中心</h1>
        </div>
      </div>

      {/* 置顶的微信登录按钮 */}
      {!isLoggedIn && <div className="px-4 pt-4">
          <Button variant="default" size="lg" onClick={handleWechatLogin} className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 w-full rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <LogIn className="w-6 h-6 mr-3" />
            <span className="text-base font-medium">微信一键登录</span>
          </Button>
          <p className="text-xs text-gray-400 text-center mt-2">登录后即可查看订单、管理地址等信息</p>
        </div>}

      <ProfileHeader userData={userData} wechatData={wechatData} onEditProfile={handleEditProfile} onWechatLogin={handleWechatLogin} isLoading={isLoading} isLoggedIn={isLoggedIn} />

      <OrderEntry isLoggedIn={isLoggedIn} onWechatLogin={handleWechatLogin} />

      <div className="m-4 bg-white rounded-lg overflow-hidden">
        {mainMenuItems.map((item, index) => <MenuItem key={index} {...item} />)}
      </div>

      <div className="m-4 bg-white rounded-lg overflow-hidden">
        {authMenuItems.map((item, index) => <MenuItem key={index} {...item} />)}
      </div>

      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>;
}