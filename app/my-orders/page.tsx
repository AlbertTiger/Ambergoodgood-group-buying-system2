'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'all', name: '全部订单', count: 12 },
    { id: 'pending', name: '待付款', count: 2 },
    { id: 'paid', name: '已付款', count: 3 },
    { id: 'shipped', name: '已发货', count: 4 },
    { id: 'delivered', name: '已完成', count: 3 },
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

  const handleOrderAction = (orderId: string, action: string) => {
    switch (action) {
      case 'pay':
        alert('跳转到支付页面');
        break;
      case 'cancel':
        if (confirm('确定要取消这个订单吗？')) {
          alert('订单已取消');
        }
        break;
      case 'confirm':
        if (confirm('确定收到商品了吗？')) {
          alert('订单已确认收货');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的订单</h1>
          <p className="text-gray-600">管理您的所有订单信息</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
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
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <i className="ri-loader-4-line text-3xl text-blue-600 animate-spin"></i>
            <p className="text-gray-600 mt-2">加载中...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <i className="ri-shopping-bag-line text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无订单</h3>
            <p className="text-gray-500 mb-6">您还没有任何订单，快去选购您喜欢的商品吧！</p>
            <Link href="/groups" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
              去团购
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">订单号：{order.order_number}</span>
                      <span className="text-sm text-gray-600">
                        下单时间：{new Date(order.created_at).toLocaleString()}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${formatOrderStatus(order.status).className}`}>
                      {formatOrderStatus(order.status).text}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={order.products?.image_url}
                      alt={order.products?.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{order.products?.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{order.products?.category}</p>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">数量：{order.quantity}</span>
                        <span className="text-sm text-red-600 font-medium">¥{order.unit_price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      收货地址：{order.shipping_address?.name} | {order.shipping_address?.phone} | {order.shipping_address?.address}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-gray-900">
                        总计：¥{order.total_amount}
                      </span>
                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleOrderAction(order.id, 'pay')}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors whitespace-nowrap"
                            >
                              立即付款
                            </button>
                            <button
                              onClick={() => handleOrderAction(order.id, 'cancel')}
                              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
                            >
                              取消订单
                            </button>
                          </>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => handleOrderAction(order.id, 'confirm')}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors whitespace-nowrap"
                          >
                            确认收货
                          </button>
                        )}
                        <Link
                          href={`/groups/${order.product_id}`}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                          查看商品
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {orders.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 whitespace-nowrap">
                <i className="ri-arrow-left-line"></i>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm whitespace-nowrap">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap">2</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap">3</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap">
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}