import { NavLink, useLocation } from 'react-router-dom';
import { Home, PenLine, BarChart3, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { track } from '@/hooks/useAmplitude';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: '홈' },
  { to: '/write', icon: PenLine, label: '기록' },
  { to: '/insight', icon: BarChart3, label: '인사이트' },
  { to: '/coaching', icon: Sparkles, label: '코칭' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || 
            (to === '/insight' && location.pathname.startsWith('/insight'));
          return (
            <NavLink
              key={to}
              to={to}
              className="relative flex flex-col items-center gap-0.5 py-1 px-3"
              onClick={() => track('nav_item_clicked', { destination: to === '/' ? 'home' : to.slice(1) })}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className={`transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
      {/* Safe area for mobile */}
      <div className="h-safe-area-inset-bottom bg-card/80" />
    </nav>
  );
};

export default BottomNav;
