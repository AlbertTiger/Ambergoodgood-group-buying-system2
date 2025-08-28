'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'all', name: '全部订单' },
    { id: 'pending', name: '待付款' },
    { id: 'paid', name: '已付款' },
    { id: 'shipped', name: '已发货' },
    { id: 'delivered', name: '已完成' },
    { id: 'cancelled', name: '已取消' },
  ];

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-orders?status=${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('获取订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatOrderStatus = (status: string) => {
    const statusMap: { [key: string]: { text: string, className: string } } = {
      pending: { text: '待付款', className: 'bg-yellow-100 text-yellow-800' },
      paid: { text: '已付款', className: 'bg-blue-100 text-blue-800' },
      shipped: { text: '已发货', className: 'bg-purple-100 text-purple-800' },
      delivered: { text: '已完成', className: 'bg-green-100 text-green-800' },
      cancelled: { text: '已取消', className: 'bg-red-100 text-red-800' }
    };
    return statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm('确定要取消此订单吗？')) {
      // 这里添加取消订单的逻辑
      alert('订单取消功能待实现');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的订单</h1>
          <p className="text-gray-600">查看和管理您的团购订单</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <i className="ri-loader-4-line text-3xl text-blue-600 animate-spin"></i>
                <p className="text-gray-600 mt-2">加载中...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order: any) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-gray-900">订单号：{order.order_number}</span>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${formatOrderStatus(order.status).className}`}>
                            {formatOrderStatus(order.status).text}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={order.products?.image_url} 
                          alt={order.products?.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{order.products?.title}</h3>
                          <p className="text-sm text-gray-600">分类：{order.products?.category}</p>
                          <p className="text-sm text-gray-600">数量：{order.quantity} 件</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-500 mb-1">¥{order.total_amount}</div>
                          <div className="text-sm text-gray-500">团购价：¥{order.products?.group_price}</div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {order.tracking_number && (
                            <span>物流单号：{order.tracking_number}</span>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          {order.status === 'pending' && (
                            <>
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors whitespace-nowrap">
                                立即付款
                              </button>
                              <button 
                                onClick={() => handleCancelOrder(order.id)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
                              >
                                取消订单
                              </button>
                            </>
                          )}
                          {order.status === 'shipped' && (
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors whitespace-nowrap">
                              确认收货
                            </button>
                          )}
                          {order.status === 'delivered' && (
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors whitespace-nowrap">
                              评价商品
                            </button>
                          )}
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors whitespace-nowrap">
                            查看详情
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="ri-shopping-bag-line text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无订单</h3>
                <p className="text-gray-600 mb-6">您还没有任何订单，快去参加团购吧！</p>
                <a 
                  href="/groups" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  去团购
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}