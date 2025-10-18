// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Input, Avatar, AvatarImage, AvatarFallback, useToast } from '@/components/ui';
// @ts-ignore;
import { User, Camera, CheckCircle } from 'lucide-react';

export default function GetUser(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [avatar, setAvatar] = useState(null);
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const currentUser = $w.auth.currentUser;
      if (!currentUser) {
        toast({
          title: '请先登录',
          description: '需要登录后才能保存信息',
          variant: 'destructive'
        });
        return;
      }

      // 准备更新数据
      const updateData = {
        nickname: nickname || '未设置昵称',
        avatar_url: avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        gender: 'unknown'
      };

      // 调用数据源保存用户信息
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'wechat_user',
        methodName: 'wedaUpsertV2',
        params: {
          filter: {
            where: {
              wxUid: {
                $eq: currentUser.userId
              }
            }
          },
          update: updateData,
          create: {
            wxUid: currentUser.userId,
            ...updateData
          }
        }
      });

      // 保存成功后显示提示并跳转回profile页面
      toast({
        title: '保存成功',
        description: '您的微信信息已更新',
        icon: <CheckCircle className="text-green-500" />
      });

      // 1秒后自动跳转回profile页面
      setTimeout(() => {
        $w.utils.navigateTo({
          pageId: 'profile'
        });
      }, 1000);
    } catch (error) {
      toast({
        title: '保存失败',
        description: error.message || '请重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-center mb-8">完善微信信息</h1>
        
        {/* 头像上传 */}
        <div className="flex flex-col items-center mb-8">
          <label htmlFor="avatar-upload" className="relative cursor-pointer">
            <Avatar className="w-24 h-24">
              {avatar ? <AvatarImage src={avatar} /> : <AvatarFallback className="bg-gray-100">
                  <User className="w-12 h-12 text-gray-400" />
                </AvatarFallback>}
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-sm">
              <Camera className="w-5 h-5 text-gray-600" />
            </div>
          </label>
          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <p className="text-sm text-gray-500 mt-2">点击上传微信头像</p>
        </div>

        {/* 昵称输入 */}
        <div className="mb-8">
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
            微信昵称
          </label>
          <Input id="nickname" type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="请输入微信昵称" />
        </div>

        {/* 提交按钮 */}
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit} disabled={!avatar || !nickname || loading}>
          {loading ? '保存中...' : '保存微信信息'}
        </Button>
      </div>
    </div>;
}