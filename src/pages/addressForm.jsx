// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, useToast, Card, CardContent, Label, Switch } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, Save, MapPin, User, Phone, Home, Building, School, Tag } from 'lucide-react';

// @ts-ignore;
import { RegionSelector } from '@/components/RegionSelector';
export default function AddressForm(props) {
  const {
    $w
  } = props;
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    postal_code: '',
    is_default: false,
    label: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [addressId, setAddressId] = useState('');
  const [selectMode, setSelectMode] = useState(false);
  const {
    toast
  } = useToast();

  // 获取当前用户ID
  const getCurrentUserId = () => {
    const currentUser = $w.auth.currentUser;
    return currentUser ? currentUser.userId : null;
  };

  // 初始化表单数据
  useEffect(() => {
    const params = $w.page.dataset.params;
    if (params) {
      // 检查是否是从选择模式进入
      if (params.selectMode === 'true') {
        setSelectMode(true);
      }

      // 检查是否是编辑模式
      if (params.address) {
        try {
          const addressData = JSON.parse(params.address);
          setFormData({
            name: addressData.name || '',
            phone: addressData.phone || '',
            province: addressData.province || '',
            city: addressData.city || '',
            district: addressData.district || '',
            address: addressData.address || '',
            postal_code: addressData.postal_code || '',
            is_default: addressData.is_default || false,
            label: addressData.label || ''
          });
          setAddressId(addressData._id);
          setIsEditMode(true);
        } catch (error) {
          console.error('解析地址数据失败:', error);
        }
      }
    }
  }, []);
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleRegionChange = region => {
    setFormData(prev => ({
      ...prev,
      ...region
    }));
  };
  const validateForm = () => {
    const errors = [];
    if (!formData.name.trim()) {
      errors.push('请输入收货人姓名');
    } else if (formData.name.trim().length < 2 || formData.name.trim().length > 20) {
      errors.push('收货人姓名长度应在2-20个字符之间');
    }
    if (!formData.phone.trim()) {
      errors.push('请输入手机号码');
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      errors.push('请输入正确的手机号码格式');
    }
    if (!formData.province) {
      errors.push('请选择省份');
    }
    if (!formData.city) {
      errors.push('请选择城市');
    }
    if (!formData.address.trim()) {
      errors.push('请输入详细地址');
    } else if (formData.address.trim().length < 5 || formData.address.trim().length > 100) {
      errors.push('详细地址长度应在5-100个字符之间');
    }
    if (formData.postal_code && !/^\d{6}$/.test(formData.postal_code)) {
      errors.push('邮政编码必须是6位数字');
    }
    return errors;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: '表单验证失败',
        description: errors.join('，'),
        variant: 'destructive'
      });
      return;
    }
    try {
      setLoading(true);
      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        toast({
          title: '请先登录',
          description: '需要登录后才能保存地址',
          variant: 'destructive'
        });
        return;
      }
      const addressData = {
        user_id: currentUserId,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        province: formData.province,
        city: formData.city,
        district: formData.district,
        address: formData.address.trim(),
        postal_code: formData.postal_code.trim(),
        is_default: formData.is_default,
        label: formData.label
      };
      if (formData.is_default) {
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
      }
      if (isEditMode) {
        // 更新地址
        await $w.cloud.callDataSource({
          dataSourceName: 'user_address',
          methodName: 'wedaUpdateV2',
          params: {
            data: addressData,
            filter: {
              where: {
                _id: {
                  $eq: addressId
                }
              }
            }
          }
        });
        toast({
          title: '更新成功',
          description: '地址信息已更新',
          variant: 'success'
        });
      } else {
        // 新增地址
        await $w.cloud.callDataSource({
          dataSourceName: 'user_address',
          methodName: 'wedaCreateV2',
          params: {
            data: addressData
          }
        });
        toast({
          title: '添加成功',
          description: '地址已成功添加',
          variant: 'success'
        });
      }

      // 返回上一页
      setTimeout(() => {
        $w.utils.navigateBack();
      }, 1000);
    } catch (error) {
      console.error('保存地址失败:', error);
      toast({
        title: '保存失败',
        description: `保存地址失败: ${error.message || '请重试'}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 text-center">
            {isEditMode ? '编辑收货地址' : '新增收货地址'}
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* 基本信息卡片 */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              收货人信息
            </h3>

            {/* 收货人姓名 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                收货人姓名 *
              </Label>
              <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="请输入收货人真实姓名" maxLength={20} />
            </div>

            {/* 手机号码 */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                手机号码 *
              </Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="请输入11位手机号码" maxLength={11} />
            </div>
          </CardContent>
        </Card>

        {/* 地址信息卡片 */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-green-600" />
              收货地址
            </h3>

            {/* 省市区选择 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                所在地区 *
              </Label>
              <RegionSelector value={{
              province: formData.province,
              city: formData.city,
              district: formData.district
            }} onChange={handleRegionChange} />
            </div>

            {/* 详细地址 */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                详细地址 *
              </Label>
              <Input id="address" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} placeholder="街道、门牌号等详细地址信息" maxLength={100} />
            </div>

            {/* 邮政编码 */}
            <div className="space-y-2">
              <Label htmlFor="postal_code" className="text-sm font-medium">
                邮政编码
              </Label>
              <Input id="postal_code" value={formData.postal_code} onChange={e => handleInputChange('postal_code', e.target.value)} placeholder="6位邮政编码（选填）" maxLength={6} />
            </div>
          </CardContent>
        </Card>

        {/* 其他信息卡片 */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium flex items-center">
              <Tag className="w-4 h-4 mr-2 text-purple-600" />
              其他信息
            </h3>

            {/* 地址标签 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                地址标签
              </Label>
              <Select value={formData.label} onValueChange={value => handleInputChange('label', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择地址标签（选填）" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="家">
                    <div className="flex items-center">
                      <Home className="w-4 h-4 mr-2" />
                      家
                    </div>
                  </SelectItem>
                  <SelectItem value="公司">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      公司
                    </div>
                  </SelectItem>
                  <SelectItem value="学校">
                    <div className="flex items-center">
                      <School className="w-4 h-4 mr-2" />
                      学校
                    </div>
                  </SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 设为默认地址 */}
            <div className="flex items-center justify-between">
              <Label htmlFor="is_default" className="text-sm font-medium">
                设为默认地址
              </Label>
              <Switch id="is_default" checked={formData.is_default} onCheckedChange={checked => handleInputChange('is_default', checked)} />
            </div>
          </CardContent>
        </Card>

        {/* 保存按钮 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? '保存中...' : isEditMode ? '更新地址' : '保存地址'}
          </Button>
        </div>
      </form>
    </div>;
}