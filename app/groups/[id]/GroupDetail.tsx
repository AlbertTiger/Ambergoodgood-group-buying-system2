
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GroupDetailProps {
  productId: string;
}

export default function GroupDetail({ productId }: GroupDetailProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    `https://readdy.ai/api/search-image?query=Fresh%20organic%20fruits%20premium%20quality%20product%20photography%20clean%20white%20background%20minimalist%20style&width=500&height=500&seq=product1&orientation=squarish`,
    `https://readdy.ai/api/search-image?query=Fresh%20organic%20fruits%20close%20up%20detail%20shot%20premium%20quality%20product%20photography%20clean%20white%20background&width=500&height=500&seq=product2&orientation=squarish`,
    `https://readdy.ai/api/search-image?query=Fresh%20organic%20fruits%20packaging%20box%20premium%20quality%20product%20photography%20clean%20white%20background&width=500&height=500&seq=product3&orientation=squarish`,
  ];

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-product-detail?id=${productId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      }
    } catch (error) {
      console.error('获取商品详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/join-group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          productId,
          quantity,
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
      } else {
        alert(data.error || '参团失败，请重试');
      }
    } catch (error) {
      alert('网络错误，请重试');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="ri-loader-4-line text-3xl text-blue-600 animate-spin"></i>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="ri-error-warning-line text-4xl text-gray-400 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">商品不存在</h2>
          <Link href="/groups" className="text-blue-600 hover:text-blue-800">
            返回商品列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">首页</Link>
          <i className="ri-arrow-right-s-line"></i>
          <Link href="/groups" className="hover:text-blue-600">团购商品</Link>
          <i className="ri-arrow-right-s-line"></i>
          <span className="text-gray-900">{product.title}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square mb-4">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <div className="flex space-x-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`商品图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-6">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2 inline-block">
              {product.tag}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center text-yellow-400 mr-3">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`ri-star-${i < Math.floor(product.rating || 4.5) ? 'fill' : 'line'} text-lg`}></i>
                ))}
              </div>
              <span className="text-gray-600">{product.rating || 4.5} ({product.reviews_count || 238} 评价)</span>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-3xl font-bold text-red-500">¥{product.group_price}</span>
                <span className="text-xl text-gray-500 line-through">¥{product.original_price}</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                  省¥{(product.original_price - product.group_price).toFixed(0)}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                已有 <span className="font-semibold text-blue-600">{product.current_participants}</span> 人参团
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>成团进度</span>
                  <span>{product.current_participants}/{product.min_participants}人</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((product.current_participants / product.min_participants) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {product.timeLeft} 后结束
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-gray-700 font-medium">数量：</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <i className="ri-subtract-line"></i>
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-50"
                >
                  <i className="ri-add-line"></i>
                </button>
              </div>
            </div>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={handleJoinGroup}
                className="flex-1 bg-red-500 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-red-600 transition-colors whitespace-nowrap"
              >
                <i className="ri-group-line mr-2"></i>
                立即参团 ¥{(product.group_price * quantity).toFixed(2)}
              </button>
              <button className="px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="ri-heart-line text-xl"></i>
              </button>
              <button className="px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="ri-share-line text-xl"></i>
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <i className="ri-shield-check-line text-2xl text-green-600 mb-2"></i>
                  <span className="text-sm text-gray-600">品质保证</span>
                </div>
                <div className="flex flex-col items-center">
                  <i className="ri-truck-line text-2xl text-blue-600 mb-2"></i>
                  <span className="text-sm text-gray-600">包邮配送</span>
                </div>
                <div className="flex flex-col items-center">
                  <i className="ri-customer-service-line text-2xl text-purple-600 mb-2"></i>
                  <span className="text-sm text-gray-600">售后服务</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
              商品详情
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              规格参数
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
              用户评价
            </button>
          </nav>
        </div>

        <div className="py-8">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">商品介绍</h3>
            <p className="text-gray-600 mb-6">
              {product.description || '这是一款优质的团购商品，精选原材料，严格品质控制，为您带来超值的购物体验。'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-semibold mb-3">产品特点</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <i className="ri-check-line text-green-600 mr-2"></i>
                    优质原材料，品质保证
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line text-green-600 mr-2"></i>
                    严格质量控制，安全可靠
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line text-green-600 mr-2"></i>
                    包装精美，适合送礼
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line text-green-600 mr-2"></i>
                    售后服务完善，无忧购买
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">配送说明</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <i className="ri-truck-line text-blue-600 mr-2"></i>
                    成团后24小时内发货
                  </li>
                  <li className="flex items-center">
                    <i className="ri-map-pin-line text-blue-600 mr-2"></i>
                    全国包邮（偏远地区除外）
                  </li>
                  <li className="flex items-center">
                    <i className="ri-time-line text-blue-600 mr-2"></i>
                    一般3-7天到达
                  </li>
                  <li className="flex items-center">
                    <i className="ri-shield-line text-blue-600 mr-2"></i>
                    支持7天无理由退换
                  </li>
                </ul>
              </div>
            </div>

            <img
              src={`https://readdy.ai/api/search-image?query=Premium%20product%20detail%20showcase%20multiple%20angles%20high%20quality%20photography%20clean%20background%20professional%20product%20photography&width=800&height=400&seq=detail1&orientation=landscape`}
              alt="商品详情"
              className="w-full rounded-lg mb-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
