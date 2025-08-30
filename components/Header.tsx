
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
              <div className="text-2xl text-blue-600 font-['Pacifico']">Group Buy</div>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href="/groups" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Products
            </Link>
            <Link href="/my-orders" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              My Orders
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Admin
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-blue-600">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-shopping-cart-line text-xl"></i>
              </div>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>
          </div>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/groups" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Products
              </Link>
              <Link href="/my-orders" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                My Orders
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Admin
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
