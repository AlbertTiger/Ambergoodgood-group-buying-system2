
'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-['Pacifico'] text-blue-600 mb-4">团购乐</div>
            <p className="text-gray-600 text-sm mb-4">
              专业的团购平台，为您提供优质的团购商品和服务
            </p>
            <div className="flex space-x-4">
              <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600">
                <i className="ri-wechat-line"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600">
                <i className="ri-weibo-line"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600">
                <i className="ri-qq-line"></i>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">购物指南</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">如何团购</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">支付方式</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">配送说明</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">退换货政策</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">商家服务</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">商家入驻</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">营销推广</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">数据分析</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">客服支持</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm flex items-center">
                <i className="ri-phone-line mr-2"></i>
                400-888-9999
              </li>
              <li className="text-gray-600 text-sm flex items-center">
                <i className="ri-mail-line mr-2"></i>
                service@tuangou.com
              </li>
              <li className="text-gray-600 text-sm flex items-center">
                <i className="ri-time-line mr-2"></i>
                周一至周日 9:00-21:00
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 团购乐. 保留所有权利 | 
            <a href="#" className="hover:text-blue-600 ml-2">服务条款</a> | 
            <a href="#" className="hover:text-blue-600 ml-2">隐私政策</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
