// @ts-ignore;
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore;
import { Card, CardContent, Button, useToast } from '@/components/ui';
// @ts-ignore;
import { ShoppingCart, Minus, Plus, Share2, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';

// @ts-ignore;
import { SpecificationSelector } from '@/components/SpecificationSelector';
export default function ProductDetail(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [product, setProduct] = useState(null);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sliderRef = useRef(null);
  const productId = props.$w.page.dataset.params.id;

  // 获取文件URL - 处理Image类型字段
  const getFileUrl = async fileObj => {
    if (!fileObj) return null;
    try {
      if (typeof fileObj === 'string') return fileObj;
      if (fileObj.fileID) {
        const tcb = await $w.cloud.getCloudInstance();
        const result = await tcb.getTempFileURL({
          fileList: [fileObj.fileID]
        });
        if (result.fileList && result.fileList[0]) {
          return result.fileList[0].tempFileURL;
        }
      }
      return null;
    } catch (error) {
      console.error('获取文件URL失败:', error);
      return null;
    }
  };

  // 处理商品图片
  const processProductImages = async images => {
    if (!images || images.length === 0) {
      return ['https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=450&fit=crop'];
    }
    return await Promise.all(images.map(async image => {
      const url = await getFileUrl(image);
      return url || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=450&fit=crop';
    }));
  };
  const loadProductDetail = async () => {
    try {
      setLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'product',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: productId
              }
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (result) {
        setProduct(result);
        const urls = await processProductImages(result.images);
        setImageUrls(urls);
        if (result.specifications && result.specifications.length > 0) {
          setSelectedSpec(result.specifications[0].options[0]);
        }
      } else {
        setTimeout(() => $w.utils.navigateBack(), 1500);
      }
    } catch (error) {
      console.error('加载商品详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 图片滑动控制
  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % imageUrls.length);
  };
  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + imageUrls.length) % imageUrls.length);
  };
  useEffect(() => {
    if (productId) loadProductDetail();
  }, [productId]);
  const handleBack = () => $w.utils.navigateBack();
  const handleAddToCart = async () => {
    if (!product || !selectedSpec) return;
    try {
      const currentUser = $w.auth.currentUser;
      if (!currentUser) {
        $w.utils.navigateTo({
          pageId: 'profile'
        });
        return;
      }

      // 检查是否已存在相同商品和规格的购物车项
      const existingCartItem = await $w.cloud.callDataSource({
        dataSourceName: 'cart',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              userId: {
                $eq: currentUser.userId
              },
              productId: {
                $eq: product._id
              },
              specification: {
                $eq: selectedSpec.label
              }
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (existingCartItem.records && existingCartItem.records.length > 0) {
        // 如果已存在，更新数量
        await $w.cloud.callDataSource({
          dataSourceName: 'cart',
          methodName: 'wedaUpdateV2',
          params: {
            filter: {
              where: {
                _id: {
                  $eq: existingCartItem.records[0]._id
                }
              }
            },
            data: {
              quantity: existingCartItem.records[0].quantity + quantity
            }
          }
        });
      } else {
        // 如果不存在，创建新的购物车项
        await $w.cloud.callDataSource({
          dataSourceName: 'cart',
          methodName: 'wedaCreateV2',
          params: {
            data: {
              userId: currentUser.userId,
              productId: product._id,
              quantity: quantity,
              specification: selectedSpec.label,
              selected: true
            }
          }
        });
      }
      const {
        dismiss
      } = toast({
        title: '已加入购物车',
        description: `${product.name} x${quantity} 已添加到购物车`
      });
      setTimeout(() => dismiss(), 1000);
    } catch (error) {
      console.error('加入购物车失败:', error);
      toast({
        title: '错误',
        description: '加入购物车失败，请重试'
      });
    }
  };
  const handleBuyNow = () => {
    if (!product || !selectedSpec) return;
    const checkoutItem = {
      id: product._id,
      name: product.name,
      spec: selectedSpec.label,
      quantity,
      price: selectedSpec.price,
      subtotal: selectedSpec.price * quantity
    };
    $w.utils.navigateTo({
      pageId: 'checkout',
      params: {
        items: JSON.stringify([checkoutItem]),
        totalAmount: selectedSpec.price * quantity,
        itemCount: quantity,
        from: 'product-detail'
      }
    });
  };
  const handleShare = () => {};
  const toggleFavorite = () => setIsFavorite(!isFavorite);
  if (loading) return <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white shadow-lg sticky top-0 z-10 p-4 flex items-center">
        <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-gray-100 active:bg-gray-200 transition-colors rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center text-gray-800">商品详情</h1>
      </div>
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    </div>;
  if (!product) return <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white shadow-lg sticky top-0 z-10 p-4 flex items-center">
        <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-gray-100 active:bg-gray-200 transition-colors rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center text-gray-800">商品详情</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <div className="text-red-500 text-2xl">❌</div>
        </div>
        <p className="text-gray-600 text-center mb-4">商品不存在或已被删除</p>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6" onClick={handleBack}>返回上一页</Button>
      </div>
    </div>;
  return <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-lg sticky top-0 z-10">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => $w.utils.navigateBack()} className="hover:bg-gray-100 active:bg-gray-200 transition-colors rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1 text-center text-gray-800">商品详情</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setIsFavorite(!isFavorite)} className={`rounded-full ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-600'}`}>
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => {}} className="rounded-full text-gray-500 hover:text-gray-600">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pb-24">
        {/* 商品图片轮播区域 */}
        {imageUrls.length > 0 && <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
            <div className="flex h-full transition-transform duration-300 ease-in-out" style={{
          transform: `translateX(-${currentImageIndex * 100}%)`
        }} ref={sliderRef}>
              {imageUrls.map((url, index) => <div key={index} className="w-full flex-shrink-0 h-full">
                  <img src={url} alt={`商品图片 ${index + 1}`} className="w-full h-full object-cover" />
                </div>)}
            </div>
            
            {/* 轮播控制按钮 */}
            {imageUrls.length > 1 && <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-opacity z-10">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-opacity z-10">
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* 轮播指示器 */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                  {imageUrls.map((_, index) => <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === index ? 'bg-white w-4' : 'bg-white bg-opacity-50'}`} />)}
                </div>
              </>}
          </div>}

        {/* 商品信息卡片 */}
        <Card className="mx-4 mt-4 shadow-lg rounded-2xl overflow-hidden border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800 leading-tight">{product?.name || '商品名称'}</h1>
              {product?.rating && <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span className="text-sm font-medium text-yellow-700">{product.rating}</span>
                </div>}
            </div>

            <div className="mb-4">
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-bold text-red-600">
                  ¥{product?.origin_price || '0.00'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 规格选择器 */}
        {product?.specifications && product.specifications.length > 0 && <Card className="mx-4 mt-4 shadow-lg rounded-2xl overflow-hidden border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-1 h-4 bg-blue-500 rounded-full mr-2"></div>
                规格参数
              </h3>
              <SpecificationSelector specifications={product.specifications} selectedSpec={selectedSpec} onSpecChange={setSelectedSpec} />
            </CardContent>
          </Card>}

        {/* 商品描述 */}
        {product?.description && <Card className="mx-4 mt-4 shadow-lg rounded-2xl overflow-hidden border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-1 h-4 bg-green-500 rounded-full mr-2"></div>
                商品描述
              </h3>
              <div className="text-gray-600 whitespace-pre-line">
                {product.description}
              </div>
            </CardContent>
          </Card>}
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex-1 rounded-full border-gray-300 hover:border-gray-400" onClick={handleAddToCart}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            加入购物车
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-md hover:shadow-lg transition-all" onClick={handleBuyNow}>
            立即购买
          </Button>
        </div>
      </div>
    </div>;
}