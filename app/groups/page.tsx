
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function GroupsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: '全部分类' },
    { id: 'food', name: '美食餐饮' },
    { id: 'fresh', name: '生鲜果蔬' },
    { id: 'home', name: '居家生活' },
    { id: 'beauty', name: '美妆护肤' },
    { id: 'digital', name: '数码电器' },
    { id: 'fashion', name: '服装配饰' },
    { id: 'sports', name: '运动户外' },
  ];

  const sortOptions = [
    { id: 'popularity', name: '人气优先' },
    { id: 'price_low', name: '价格从低到高' },
    { id: 'price_high', name: '价格从高到低' },
    { id: 'time', name: '即将截止' },
    { id: 'new', name: '最新发布' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-products?category=${selectedCategory}&sortBy=${sortBy}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGroups(data.products || []);
      }
    } catch (error) {
      console.error('获取商品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (productId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/join-group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          productId,
          quantity: 1,
          shippingAddress: {
            name: '用户姓名',
            phone: '13800138000',
            address: '收货地址'
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`参团成功！订单号：${data.orderNumber}`);
        fetchProducts(); // 刷新商品数据
      } else {
        alert(data.error || '参团失败，请重试');
      }
    } catch (error) {
      alert('网络错误，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">团购商品</h1>
          <p className="text-gray-600">发现更多优质团购商品，享受超值优惠</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">排序：</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap"
              >
                <i className="ri-filter-line"></i>
                <span>筛选</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">价格区间</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" />
                      <span className="text-sm">0-50元</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" />
                      <span className="text-sm">50-100元</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" />
                      <span className="text-sm">100-200元</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" />
                      <span className="text-sm">200元以上</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">成团状态</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" />
                      <span className="text-sm">即将成团</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" />
                      <span className="text-sm">正在进行</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" />
                      <span className="text-sm">新发布</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">商品产地</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" />
                      <span className="text-sm">国内</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" />
                      <span className="text-sm">进口</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-600">
            共找到 <span className="font-medium text-gray-900">{groups.length}</span> 个团购商品
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <i className="ri-loader-4-line text-3xl text-blue-600 animate-spin"></i>
            <p className="text-gray-600 mt-2">加载中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-product-shop>
            {groups.map((group: any) => (
              <div key={group.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border">
                <div className="relative">
                  <img 
                    src={group.image_url} 
                    alt={group.title}
                    className="w-full h-48 object-cover object-top"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {group.tag}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {group.timeLeft}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded text-xs text-gray-700">
                    <i className="ri-map-pin-line mr-1"></i>
                    {group.location}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{group.title}</h3>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`ri-star-${i < Math.floor(group.rating) ? 'fill' : 'line'} text-sm`}></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{group.rating} ({group.reviews_count})</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-red-500">¥{group.group_price}</span>
                      <span className="text-gray-500 line-through">¥{group.original_price}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      已参团 {group.current_participants}人
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>成团进度</span>
                      <span>{group.current_participants}/{group.min_participants}人</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${group.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link 
                      href={`/groups/${group.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
                    >
                      查看详情
                    </Link>
                    <button 
                      onClick={() => handleJoinGroup(group.id)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      立即参团
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 whitespace-nowrap">
              <i className="ri-arrow-left-line"></i>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm whitespace-nowrap">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap">3</button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap">10</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap">
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
