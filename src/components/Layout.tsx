import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Package,
  Truck,
  CreditCard,
  RotateCcw,
  BarChart3,
  Activity,
  Settings,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Store, label: 'Stores', href: '/stores' },
    { icon: Package, label: 'Products', href: '/products' },
    { icon: Truck, label: 'Suppliers', href: '/suppliers' },
    { icon: CreditCard, label: 'Credits', href: '/credits' },
    { icon: RotateCcw, label: 'Returns', href: '/returns' },
    { icon: BarChart3, label: 'Reports', href: '/reports' },
    { icon: Activity, label: 'Service Status', href: '/service-status' },
    { icon: Settings, label: 'Admin', href: '/admin' },
  ];

  return (
    <div className="min-h-screen bg-red-600 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold text-white">Flakes</h1>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white hover:bg-blue-800 transition-colors duration-200"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 flex justify-end items-center">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                Admin User
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}