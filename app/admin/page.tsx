
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalRevenue: '0',
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchAdminStats();
    }
  }, [activeTab]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-stats`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
        setTopProducts(data.topProducts);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-6">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-['Pacifico'] text-blue-600">团购乐</div>
            </Link>
            <div className="text-sm text-gray-500 mt-1">商家后台</div>
          </div>
          
          <nav className="mt-6">
            <div className="px-6">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-dashboard-line mr-3"></i>
                  数据概览
                </button>
                
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === 'products' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-product-hunt-line mr-3"></i>
                  商品管理
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-shopping-bag-line mr-3"></i>
                  订单管理
                </button>
                
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === 'analytics' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-bar-chart-line mr-3"></i>
                  数据分析
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-settings-line mr-3"></i>
                  设置
                </button>
              </div>
            </div>
            
            <div className="mt-auto p-6">
              <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <i className="ri-home-line mr-2"></i>
                返回前台
              </Link>
            </div>
          </nav>
        </div>

        <div className="flex-1">
          <header className="bg-white shadow-sm border-b">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {activeTab === 'overview' && '数据概览'}
                    {activeTab === 'products' && '商品管理'}
                    {activeTab === 'orders' && '订单管理'}
                    {activeTab === 'analytics' && '数据分析'}
                    {activeTab === 'settings' && '设置'}
                  </h1>
                  <p className="text-gray-600 mt-1">管理您的团购业务</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="relative p-2 text-gray-600 hover:text-blue-600">
                    <i className="ri-notification-line text-xl"></i>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-blue-600"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium">管理员</div>
                      <div className="text-xs text-gray-500">admin@tuangou.com</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {loading ? (
                  <div className="text-center py-12">
                    <i className="ri-loader-4-line text-3xl text-blue-600 animate-spin"></i>
                    <p className="text-gray-600 mt-2">加载中...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm">总销售额</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">¥{stats.totalRevenue}</p>
                            <p className="text-sm mt-2 text-green-600">+12.5%</p>
                          </div>
                          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                            <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm">活跃订单</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                            <p className="text-sm mt-2 text-blue-600">+8.2%</p>
                          </div>
                          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                            <i className="ri-shopping-bag-line text-2xl text-blue-600"></i>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm">团购商品</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
                            <p className="text-sm mt-2 text-purple-600">+5.1%</p>
                          </div>
                          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                            <i className="ri-product-hunt-line text-2xl text-purple-600"></i>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm">注册用户</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                            <p className="text-sm mt-2 text-orange-600">+15.3%</p>
                          </div>
                          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                            <i className="ri-user-add-line text-2xl text-orange-600"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white rounded-xl shadow-sm border">
                        <div className="p-6 border-b border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900">最近订单</h3>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {recentOrders.length > 0 ? recentOrders.map((order: any, index) => (
                              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-900">{order.order_number}</span>
                                    <span className="text-sm text-gray-500">
                                      {new Date(order.created_at).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600">{order.products?.title}</div>
                                  <div className="text-sm text-gray-500">客户：{order.users?.full_name || '未知用户'}</div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="font-semibold text-gray-900">¥{order.total_amount}</div>
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${formatOrderStatus(order.status).className}`}>
                                    {formatOrderStatus(order.status).text}
                                  </span>
                                </div>
                              </div>
                            )) : (
                              <div className="text-center py-8 text-gray-500">
                                <i className="ri-shopping-bag-line text-3xl mb-2"></i>
                                <p>暂无订单数据</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-sm border">
                        <div className="p-6 border-b border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900">热销商品</h3>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {topProducts.length > 0 ? topProducts.map((product: any, index) => (
                              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 mb-1">{product.title}</div>
                                  <div className="text-sm text-gray-600">销量：{product.current_participants} 件</div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="font-semibold text-gray-900">¥{product.group_price}</div>
                                  <div className="text-sm text-green-600">进度：{Math.min(Math.round((product.current_participants / product.min_participants) * 100), 100)}%</div>
                                </div>
                              </div>
                            )) : (
                              <div className="text-center py-8 text-gray-500">
                                <i className="ri-product-hunt-line text-3xl mb-2"></i>
                                <p>暂无商品数据</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">商品列表</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                      <i className="ri-add-line mr-2"></i>
                      添加商品
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">商品名称</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">分类</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">原价</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">团购价</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">参团人数</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">状态</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <img src="https://readdy.ai/api/search-image?query=Fresh%20red%20apples%20product%20image&width=50&height=50&seq=apple3&orientation=squarish" 
                                   className="w-10 h-10 rounded-lg object-cover mr-3" alt="" />
                              <span className="font-medium">新疆阿克苏苹果</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">生鲜果蔬</td>
                          <td className="py-4 px-4">¥89</td>
                          <td className="py-4 px-4 text-red-600 font-semibold">¥59</td>
                          <td className="py-4 px-4">142/100</td>
                          <td className="py-4 px-4">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">进行中</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <i className="ri-edit-line"></i>
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <img src="https://readdy.ai/api/search-image?query=Thai%20durian%20fruit%20product%20image&width=50&height=50&seq=durian3&orientation=squarish" 
                                   className="w-10 h-10 rounded-lg object-cover mr-3" alt="" />
                              <span className="font-medium">泰国进口榴莲</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">生鲜果蔬</td>
                          <td className="py-4 px-4">¥168</td>
                          <td className="py-4 px-4 text-red-600 font-semibold">¥128</td>
                          <td className="py-4 px-4">89/50</td>
                          <td className="py-4 px-4">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">进行中</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <i className="ri-edit-line"></i>
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">订单管理</h3>
                <div className="text-center py-12 text-gray-500">
                  <i className="ri-shopping-bag-line text-4xl mb-4"></i>
                  <p>订单管理功能开发中...</p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">数据分析</h3>
                <div className="text-center py-12 text-gray-500">
                  <i className="ri-bar-chart-line text-4xl mb-4"></i>
                  <p>数据分析功能开发中...</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">系统设置</h3>
                <div className="text-center py-12 text-gray-500">
                  <i className="ri-settings-line text-4xl mb-4"></i>
                  <p>系统设置功能开发中...</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
