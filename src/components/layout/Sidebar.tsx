import { Link } from "react-router-dom";
import {
  Home,
  CreditCard,
  DollarSign,
  LineChart,
  Target,
  Calendar,
  Settings,
} from "lucide-react";
import { useTranslation } from 'react-i18next';

interface Account {
  name: string;
  balance: number;
  type: "credit" | "depository" | "investment" | "upcoming" | "savings";
}

interface SidebarProps {
  accounts: Account[];
  onError?: (error: Error) => void;
}

export default function Sidebar({ accounts, onError }: SidebarProps) {
  const { t } = useTranslation();

  try {
    const menuItems = [
      { icon: <Home className="w-4 h-4" />, label: t('nav.dashboard'), path: '/' },
      { icon: <CreditCard className="w-4 h-4" />, label: t('nav.expenses'), path: '/expenses' },
      { icon: <DollarSign className="w-4 h-4" />, label: t('nav.income'), path: '/income' },
      { icon: <LineChart className="w-4 h-4" />, label: t('nav.reports'), path: '/reports' },
      { icon: <Target className="w-4 h-4" />, label: t('nav.goals'), path: '/goals' },
      { icon: <Calendar className="w-4 h-4" />, label: t('nav.calendar'), path: '/calendar' },
      { icon: <Settings className="w-4 h-4" />, label: t('nav.settings'), path: '/settings' },
    ];

    return (
      <div className="h-full bg-[#0A0D14] text-white p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          <h3 className="px-3 text-sm font-medium text-white/60 mb-2">{t('nav.accounts')}</h3>
          <div className="space-y-1">
            {accounts.map((account) => (
              <div
                key={account.name}
                className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <span>{account.name}</span>
                <span>${account.balance.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    onError?.(error as Error);
    return null;
  }
} 