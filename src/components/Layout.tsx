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
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Flakes</h1>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.label} className="nav-item">
                <a
                  href={item.href}
                  className="nav-link"
                >
                  <item.icon className="nav-icon" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="user-info">
            <div>
              <span>
                Admin User
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}