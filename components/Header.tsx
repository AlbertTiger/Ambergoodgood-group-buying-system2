
'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-['Pacifico'] text-blue-600">团购乐</div>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              首页
            </Link>
            <Link href="/groups" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              团购商品
            </Link>
            <Link href="/my-orders" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              我的订单
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              商家后台
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-blue-600">
              <i className="ri-shopping-cart-line text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap">
              登录/注册
            </button>
          </div>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                首页
              </Link>
              <Link href="/groups" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                团购商品
              </Link>
              <Link href="/my-orders" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                我的订单
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                商家后台
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
