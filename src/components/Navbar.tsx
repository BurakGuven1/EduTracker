import React from 'react';
import { BookOpen, User, Bell, Menu } from 'lucide-react';

interface NavbarProps {
  user?: any;
  onLogin: () => void;
  onMenuToggle: () => void;
}

export default function Navbar({ user, onLogin, onMenuToggle }: NavbarProps) {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">EduTracker</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Özellikler</a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Paketler</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">İletişim</a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-blue-600" />
                <div className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Giriş Yap
              </button>
            )}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}