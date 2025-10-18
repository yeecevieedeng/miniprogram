// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, ShoppingCart, ChevronRight, ChevronLeft, Play } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Card, CardContent, useToast } from '@/components/ui';

// @ts-ignore;
import { TabBar } from '@/components/TabBar';
// @ts-ignore;
import { CarouselModal } from '@/components/CarouselModal';
export default function Home(props) {
  const {
    $w
  } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [carouselData, setCarouselData] = useState([]);
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    mediaType: 'image',
    mediaUrl: '',
    title: ''
  });
  const {
    toast
  } = useToast();

  // 获取文件URL - 处理File类型字段
  const getFileUrl = async fileObj => {
    if (!fileObj) return null;
    try {
      // 如果已经是URL字符串，直接返回
      if (typeof fileObj === 'string') {
        return fileObj;
      }

      // 如果是文件对象，尝试获取临时URL
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

  // 获取默认图片URL
  const getDefaultImageUrl = () => {
    // 默认食品图片URL数组
    const defaultImages = ['https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1565299585323-38174c739b6d?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=450&fit=crop', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=450&fit=crop'];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  };

  // 加载轮播图数据
  const loadCarouselData = async () => {
    try {
      setLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'carousel',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              is_active: {
                $eq: true
              }
            }
          },
          select: {
            $master: true
          },
          orderBy: [{
            display_order: 'asc'
          }],
          pageSize: 10
        }
      });

      // 处理媒体文件URL - 使用image字段
      const processedData = await Promise.all((result.records || []).map(async slide => {
        let imageUrl = null;

        // 优先使用image字段
        if (slide.image) {
          imageUrl = await getFileUrl(slide.image);
        }

        // 如果没有image字段或获取失败，使用默认图片
        if (!imageUrl) {
          imageUrl = getDefaultImageUrl();
        }
        return {
          ...slide,
          image_url: imageUrl
        };
      }));
      setCarouselData(processedData.filter(slide => slide.image_url)); // 只保留有图片URL的轮播图
    } catch (error) {
      console.error('加载轮播图失败:', error);
      toast({
        title: '加载失败',
        description: '获取轮播图数据失败',
        variant: 'destructive'
      });
      // 使用默认数据作为后备
      setCarouselData([{
        _id: '1',
        media_type: 'image',
        image_url: getDefaultImageUrl()
      }, {
        _id: '2',
        media_type: 'image',
        image_url: getDefaultImageUrl()
      }, {
        _id: '3',
        media_type: 'image',
        image_url: getDefaultImageUrl()
      }]);
    } finally {
      setLoading(false);
    }
  };

  // 热门分类 - 更新为与下单页一致的中药养生分类
  const categories = [{
    id: 'qi',
    name: '补气养元',
    icon: '🌿',
    color: 'bg-green-100'
  }, {
    id: 'pi',
    name: '健脾祛湿',
    icon: '🍵',
    color: 'bg-yellow-100'
  }, {
    id: 'yin',
    name: '滋阴润燥',
    icon: '❄️',
    color: 'bg-blue-100'
  }, {
    id: 'xue',
    name: '活血养心',
    icon: '❤️',
    color: 'bg-red-100'
  }, {
    id: 'jun',
    name: '菌菇滋补',
    icon: '🍄',
    color: 'bg-purple-100'
  }, {
    id: 'shen',
    name: '安神调和',
    icon: '🌙',
    color: 'bg-indigo-100'
  }];

  // 轮播图自动播放
  useEffect(() => {
    const timer = setInterval(() => {
      if (carouselData.length > 0) {
        setCurrentSlide(prev => (prev + 1) % carouselData.length);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselData.length]);
  useEffect(() => {
    loadCarouselData();
  }, []);

  // 处理分类点击 - 传递分类ID到下单页面
  const handleCategoryClick = categoryId => {
    $w.utils.navigateTo({
      pageId: 'order-new',
      params: {
        category: categoryId
      }
    });
  };
  const handleSearch = () => {
    if (searchQuery.trim()) {
      $w.utils.navigateTo({
        pageId: 'order-new',
        params: {
          search: searchQuery
        }
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
    if (tabId !== 'home') {
      $w.utils.navigateTo({
        pageId: pageMap[tabId]
      });
    }
  };
  const handleBannerPreview = slide => {
    setPreviewModal({
      isOpen: true,
      mediaType: slide.media_type,
      mediaUrl: slide.image_url,
      title: ''
    });
  };
  const closePreviewModal = () => {
    setPreviewModal(prev => ({
      ...prev,
      isOpen: false
    }));
  };
  const nextSlide = () => {
    if (carouselData.length > 0) {
      setCurrentSlide(prev => (prev + 1) % carouselData.length);
    }
  };
  const prevSlide = () => {
    if (carouselData.length > 0) {
      setCurrentSlide(prev => (prev - 1 + carouselData.length) % carouselData.length);
    }
  };
  const goToSlide = index => {
    setCurrentSlide(index);
  };
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部搜索栏 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input type="text" placeholder="搜索" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()} className="pl-10 pr-4 py-2 w-full" />
            </div>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSearch}>
              搜索
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="p-4 space-y-6">
        {/* 16:9轮播图 - 只展示照片视频，不显示文字 */}
        {loading ? <div className="aspect-[16/9] bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div> : carouselData.length > 0 ? <div className="relative overflow-hidden rounded-lg aspect-[16/9]">
            <div className="flex transition-transform duration-500 ease-in-out h-full" style={{
          transform: `translateX(-${currentSlide * 100}%)`
        }}>
              {carouselData.map(slide => <div key={slide._id} className="w-full flex-shrink-0 h-full relative">
                  {slide.media_type === 'image' ? <img src={slide.image_url} alt="" className="w-full h-full object-cover cursor-pointer" onClick={() => handleBannerPreview(slide)} /> : slide.media_type === 'video' ? <div className="w-full h-full relative">
                        <video src={slide.image_url} className="w-full h-full object-cover" onClick={() => handleBannerPreview(slide)} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button variant="outline" className="bg-black bg-opacity-50 text-white hover:bg-opacity-70 border-white" onClick={e => {
                  e.stopPropagation();
                  handleBannerPreview(slide);
                }}>
                            <Play className="w-6 h-6" />
                          </Button>
                        </div>
                      </div> : null}
                </div>)}
            </div>

            {/* 轮播控制按钮 */}
            <button onClick={prevSlide} className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-opacity z-40">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextSlide} className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-opacity z-40">
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* 轮播指示器 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
              {carouselData.map((_, index) => <button key={index} onClick={() => goToSlide(index)} className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-white w-6' : 'bg-white bg-opacity-50'}`}></button>)}
            </div>
          </div> : <div className="aspect-[16/9] bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">暂无轮播图数据</span>
          </div>}

        {/* 热门分类 */}
        <div>
          <h2 className="text-lg font-semibold mb-3">热门分类</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map(category => <div key={category.id} className="bg-white rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCategoryClick(category.id)}>
                <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-xl">{category.icon}</span>
                </div>
                <p className="text-sm font-medium">{category.name}</p>
              </div>)}
          </div>
        </div>

        {/* 底部提示 */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">更多滋补美味，尽在和屿食补</p>
        </div>
      </div>

      {/* 底部导航栏 */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 轮播图预览模态框 */}
      <CarouselModal isOpen={previewModal.isOpen} onClose={closePreviewModal} mediaType={previewModal.mediaType} mediaUrl={previewModal.mediaUrl} title={previewModal.title} />
    </div>;
}