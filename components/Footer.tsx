
'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl text-blue-600 mb-4 font-['Pacifico']">Group Buy</div>
            <p className="text-gray-600 text-sm mb-4">
              Professional group buying platform providing quality products and services
            </p>
            <div className="flex space-x-4">
              <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600">
                <i className="ri-wechat-line"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600">
                <i className="ri-twitter-line"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600">
                <i className="ri-facebook-line"></i>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Shopping Guide</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">How to Group Buy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Payment Methods</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Shipping Info</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Return Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Merchant Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Merchant Registration</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Marketing Tools</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Analytics</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Customer Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm flex items-center">
                <div className="w-4 h-4 flex items-center justify-center mr-2">
                  <i className="ri-phone-line"></i>
                </div>
                1-800-GROUP-BUY
              </li>
              <li className="text-gray-600 text-sm flex items-center">
                <div className="w-4 h-4 flex items-center justify-center mr-2">
                  <i className="ri-mail-line"></i>
                </div>
                support@groupbuy.com
              </li>
              <li className="text-gray-600 text-sm flex items-center">
                <div className="w-4 h-4 flex items-center justify-center mr-2">
                  <i className="ri-time-line"></i>
                </div>
                Mon-Sun 9:00-21:00
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Group Buy Platform. All rights reserved | 
            <a href="#" className="hover:text-blue-600 ml-2">Terms of Service</a> | 
            <a href="#" className="hover:text-blue-600 ml-2">Privacy Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
