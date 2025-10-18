// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { ChevronLeft, Phone, MessageCircle } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent, Button, useToast } from '@/components/ui';

export default function About(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  const handleCopyWechat = () => {
    // 模拟复制微信号到剪贴板
    toast({
      title: '微信号已复制',
      description: '微信号: Heyu_Eat 已复制到剪贴板',
      variant: 'success'
    });
  };
  const handleCopyPhone = () => {
    // 模拟复制电话号码到剪贴板
    toast({
      title: '电话号码已复制',
      description: '联系电话: 17796004862 已复制到剪贴板',
      variant: 'success'
    });
  };
  return <div className="min-h-screen bg-gray-50 pb-8">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 text-center">关于我们</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* 品牌标识区域 */}
      <div className="p-6 bg-white shadow-sm">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800">和屿食补</h2>
        </div>
      </div>

      {/* 介绍内容 */}
      <Card className="m-4">
        <CardContent className="p-6">
          <p className="text-gray-600 text-sm leading-6 mb-4">
            和屿食补专注于提供优质汤品食材。我们致力于为用户提供最健康、优质的汤品食材。
          </p>
          <p className="text-gray-600 text-sm leading-6">
            从选材到配送，我们严格把控每一个环节，确保您收到的每一份食材都符合高标准，和屿食补都是您最值得信赖的选择。
          </p>
        </CardContent>
      </Card>

      {/* 联系信息 */}
      <Card className="m-4">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">联系我们</h3>
          <div className="space-y-4">
            {/* 联系电话 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-blue-500 mr-3" />
                <span className="text-sm text-gray-600">联系电话</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCopyPhone} className="text-blue-600 hover:text-blue-700">
                17796004862
              </Button>
            </div>
            
            {/* 联系微信 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 text-green-500 mr-3" />
                <span className="text-sm text-gray-600">微信客服</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCopyWechat} className="text-green-600 hover:text-green-700">
                Heyu_Eat
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}