
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [featuredGroups, setFeaturedGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: '全部', icon: 'ri-grid-line' },
    { id: 'food', name: '美食', icon: 'ri-restaurant-line' },
    { id: 'fresh', name: '生鲜', icon: 'ri-leaf-line' },
    { id: 'home', name: '居家', icon: 'ri-home-line' },
    { id: 'beauty', name: '美妆', icon: 'ri-heart-line' },
    { id: 'digital', name: '数码', icon: 'ri-smartphone-line' },
  ];

  const stats = [
    { label: '活跃团购', value: '2,847', icon: 'ri-group-line' },
    { label: '今日成团', value: '186', icon: 'ri-check-line' },
    { label: '用户数量', value: '128万', icon: 'ri-user-line' },
    { label: '商家入驻', value: '5,632', icon: 'ri-store-line' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-products?category=${activeCategory}&limit=6`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFeaturedGroups(data.products || []);
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
      
      <div 
        className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20group%20buying%20shopping%20concept%20with%20people%20holding%20shopping%20bags%20and%20mobile%20phones%2C%20bright%20colorful%20gradient%20background%2C%20digital%20commerce%20illustration%2C%20clean%20minimalist%20style&width=1200&height=500&seq=hero1&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                一起团购，省钱更省心
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100">
                汇聚优质商品，享受团购优惠，让购物变得更简单
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/groups" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                  立即团购
                </Link>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors whitespace-nowrap">
                  了解更多
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto rounded-full mb-4">
                <i className={`${stat.icon} text-2xl text-blue-600`}></i>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">热门团购商品</h2>
          <p className="text-gray-600 text-lg">精选优质商品，限时团购优惠</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
            >
              <i className={`${category.icon} text-lg`}></i>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <i className="ri-loader-4-line text-3xl text-blue-600 animate-spin"></i>
            <p className="text-gray-600 mt-2">加载中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-product-shop>
            {featuredGroups.map((group: any) => (
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
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{group.title}</h3>
                  
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

                  <button 
                    onClick={() => handleJoinGroup(group.id)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    立即参团
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/groups" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
            查看更多团购
          </Link>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择团购乐？</h2>
            <p className="text-gray-600 text-lg">专业的团购平台，为您提供更好的购物体验</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 flex items-center justify-center mx-auto rounded-full mb-6">
                <i className="ri-price-tag-3-line text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">超值优惠</h3>
              <p className="text-gray-600">团购价格比市场价低20-50%，让您享受真正的实惠</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 flex items-center justify-center mx-auto rounded-full mb-6">
                <i className="ri-shield-check-line text-3xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">品质保证</h3>
              <p className="text-gray-600">严格筛选优质商家，确保每一件商品都符合品质标准</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 flex items-center justify-center mx-auto rounded-full mb-6">
                <i className="ri-truck-line text-3xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">快速配送</h3>
              <p className="text-gray-600">成团后24小时内发货，专业物流配送，确保商品及时到达</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
