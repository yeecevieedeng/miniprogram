// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ChevronLeft, User, Phone, VenusMars } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Avatar, AvatarImage, AvatarFallback, useToast } from '@/components/ui';

export default function ProfileEdit(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    gender: ''
  });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 从本地存储获取用户信息
  useEffect(() => {
    loadUserData();
  }, []);
  const loadUserData = async () => {
    try {
      // 从本地存储获取用户信息
      const storedUser = localStorage.getItem('user_profile');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setFormData({
          nickname: userData.nickname || '',
          phone: userData.phone || '',
          gender: userData.gender || ''
        });
        setAvatarUrl(userData.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100');
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载用户信息',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async () => {
    if (!formData.nickname.trim()) {
      toast({
        title: '请输入昵称',
        variant: 'destructive'
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // 获取当前用户信息
      const storedUser = localStorage.getItem('user_profile');
      if (!storedUser) {
        throw new Error('用户未登录');
      }
      const userData = JSON.parse(storedUser);

      // 更新用户信息到数据模型
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'user_profile',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            nickname: formData.nickname,
            phone: formData.phone,
            gender: formData.gender
          },
          filter: {
            where: {
              openid: {
                $eq: userData.openid
              }
            }
          }
        }
      });
      if (result.count > 0) {
        // 更新本地存储
        const updatedUser = {
          ...userData,
          ...formData
        };
        localStorage.setItem('user_profile', JSON.stringify(updatedUser));
        toast({
          title: '保存成功',
          description: '个人信息已更新',
          variant: 'success'
        });

        // 返回上一页
        setTimeout(() => {
          $w.utils.navigateBack();
        }, 1500);
      } else {
        throw new Error('更新失败');
      }
    } catch (error) {
      console.error('保存用户信息失败:', error);
      toast({
        title: '保存失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">加载中...</p>
      </div>
    </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-8">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 text-center">编辑资料</h1>
          <Button variant="ghost" size="sm" onClick={handleSubmit} disabled={isSubmitting} className="text-blue-600 hover:text-blue-700 disabled:opacity-50">
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>

      {/* 头像展示 */}
      <div className="p-6 bg-white shadow-sm">
        <div className="flex flex-col items-center">
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatarUrl} alt={formData.nickname} />
            <AvatarFallback>
              <User className="w-10 h-10" />
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-gray-500 mt-2">微信头像</p>
        </div>
      </div>

      {/* 表单编辑区域 */}
      <div className="m-4 bg-white rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium">基本信息</h3>
        </div>
        
        <div className="p-4 space-y-4">
          {/* 昵称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              昵称
            </label>
            <Input value={formData.nickname} onChange={e => handleInputChange('nickname', e.target.value)} placeholder="请输入您的昵称" className="w-full" />
          </div>

          {/* 电话 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              手机号码
            </label>
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-gray-400 mr-2" />
              <Input value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="请输入手机号码" className="w-full" type="tel" />
            </div>
          </div>

          {/* 性别 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              性别
            </label>
            <div className="flex items-center">
              <VenusMars className="w-4 h-4 text-gray-400 mr-2" />
              <select value={formData.gender} onChange={e => handleInputChange('gender', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">请选择性别</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="m-4">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : '保存修改'}
        </Button>
      </div>
    </div>;
}