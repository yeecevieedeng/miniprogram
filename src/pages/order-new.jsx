// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, ShoppingCart } from 'lucide-react';
// @ts-ignore;
import { Button, Input, useToast } from '@/components/ui';

// @ts-ignore;
import { TabBar } from '@/components/TabBar';
// @ts-ignore;
import { CategorySidebar } from '@/components/CategorySidebar';
export default function OrderNew(props) {
  const {
    $w
  } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('order-new');
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();

  // 加载商品数据
  const loadProducts = async () => {
    try {
      setLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'product',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              is_available: {
                $eq: true
              }
            }
          },
          select: {
            $master: true
          },
          pageSize: 100
        }
      });
      setProducts(result.records || []);
    } catch (error) {
      console.error('加载商品失败:', error);
      toast({
        title: '加载失败',
        description: '获取商品信息失败',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 搜索和筛选逻辑
  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category_ids && p.category_ids.includes(selectedCategory));
    }
    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);
  useEffect(() => {
    loadProducts();
  }, []);

  // 添加到购物车
  const handleAddToCart = async product => {
    try {
      const currentUser = $w.auth.currentUser;
      if (!currentUser) {
        toast({
          title: '请先登录',
          description: '需要登录后才能添加商品到购物车',
          variant: 'destructive'
        });
        $w.utils.navigateTo({
          pageId: 'profile'
        });
        return;
      }
      const existing = await $w.cloud.callDataSource({
        dataSourceName: 'cart',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                userId: {
                  $eq: currentUser.userId
                }
              }, {
                productId: {
                  $eq: product._id
                }
              }]
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (existing.records && existing.records.length > 0) {
        await $w.cloud.callDataSource({
          dataSourceName: 'cart',
          methodName: 'wedaUpdateV2',
          params: {
            filter: {
              where: {
                $and: [{
                  userId: {
                    $eq: currentUser.userId
                  }
                }, {
                  productId: {
                    $eq: product._id
                  }
                }]
              }
            },
            data: {
              quantity: existing.records[0].quantity + 1
            }
          }
        });
      } else {
        await $w.cloud.callDataSource({
          dataSourceName: 'cart',
          methodName: 'wedaCreateV2',
          params: {
            data: {
              userId: currentUser.userId,
              productId: product._id,
              quantity: 1,
              specification: '',
              selected: true
            }
          }
        });
      }
      const {
        dismiss
      } = toast({
        title: '已加入购物车',
        description: `${product.name} 已添加到购物车`
      });
      setTimeout(() => dismiss(), 1000);
    } catch (error) {
      toast({
        title: '添加失败',
        description: '添加到购物车失败，请重试',
        variant: 'destructive'
      });
    }
  };
  const handleProductClick = product => {
    $w.utils.navigateTo({
      pageId: 'product-detail',
      params: {
        id: product._id,
        name: product.name,
        price: product.origin_price,
        description: product.description
      }
    });
  };
  const handleTabChange = tabId => {
    setActiveTab(tabId);
    if (tabId !== 'order-new') $w.utils.navigateTo({
      pageId: tabId
    });
  };
  const categories = [{
    id: 'all',
    name: '全部',
    icon: '🍲'
  }, {
    id: 'qi',
    name: '补气养元',
    icon: '🌿'
  }, {
    id: 'pi',
    name: '健脾祛湿',
    icon: '🍵'
  }, {
    id: 'yin',
    name: '滋阴润燥',
    icon: '❄️'
  }, {
    id: 'xue',
    name: '活血养心',
    icon: '❤️'
  }, {
    id: 'jun',
    name: '菌菇滋补',
    icon: '🍄'
  }, {
    id: 'shen',
    name: '安神调和',
    icon: '🌙'
  }];

  // 获取商品图片URL
  const getProductImage = product => {
    if (product.images && product.images.length > 0) {
      return product.images[0]; // 使用第一张图片
    }
    // 如果没有图片，使用默认的emoji图标
    return null;
  };
  return <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10 p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input type="text" placeholder="搜索" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full" />
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => searchQuery}>
            搜索
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <CategorySidebar categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-500">加载中...</span>
            </div> : filteredProducts.length > 0 ? <div className="space-y-4">
              {filteredProducts.map(product => {
            const productImage = getProductImage(product);
            return <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer w-full" onClick={() => handleProductClick(product)}>
                  <div className="flex">
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                      {productImage ? <img src={productImage} alt={product.name} className="w-full h-full object-cover" onError={e => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }} /> : <span className="text-2xl">🍲</span>}
                    </div>
                    <div className="p-3 flex-1">
                      <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-red-500 font-bold text-sm">¥{product.origin_price?.toFixed(2)}</span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50" onClick={e => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}>
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>;
          })}
            </div> : <div className="text-center py-8">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500 mb-2">没有找到相关商品</p>
              <Button variant="outline" size="sm" onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}>
                清空筛选
              </Button>
            </div>}
        </div>
      </div>

      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>;
}