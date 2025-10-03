import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStore } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import { 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Edit2, 
  Trash2,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import type { Investment } from '@/lib/store';
import AddInvestmentDialog from '@/components/investments/AddInvestmentDialog';

export default function Investments() {
  const { t } = useTranslation();
  const { 
    investments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    updateInvestmentValue,
    calculateInvestmentStatistics
  } = useStore();

  const [showAddDialog, setShowAddDialog] = useState(false);

  const stats = calculateInvestmentStatistics();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getInvestmentTypeIcon = (type: string) => {
    switch (type) {
      case 'stocks':
      case 'index_funds':
        return <TrendingUp className="w-4 h-4" />;
      case 'bitcoin':
      case 'ethereum':
      case 'altcoins':
      case 'crypto_index':
        return <Activity className="w-4 h-4" />;
      case 'government_bonds':
      case 'corporate_bonds':
      case 'municipal_bonds':
      case 'treasury_bills':
        return <BarChart3 className="w-4 h-4" />;
      case 'mutual_funds':
      case 'etf':
        return <PieChart className="w-4 h-4" />;
      case 'gold':
      case 'silver':
      case 'platinum':
      case 'oil':
      case 'natural_gas':
      case 'agricultural':
      case 'commodity_etf':
        return <DollarSign className="w-4 h-4" />;
      case 'residential_property':
      case 'commercial_property':
      case 'reits':
      case 'real_estate_funds':
        return <LineChart className="w-4 h-4" />;
      case 'savings_account':
      case 'cd':
      case 'money_market':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <LineChart className="w-4 h-4" />;
    }
  };

  const getInvestmentTypeLabel = (type: string) => {
    const labels = {
      stocks: 'Stocks',
      etf: 'ETFs',
      mutual_funds: 'Mutual Funds',
      index_funds: 'Index Funds',
      government_bonds: 'Government Bonds',
      corporate_bonds: 'Corporate Bonds',
      municipal_bonds: 'Municipal Bonds',
      treasury_bills: 'Treasury Bills',
      bitcoin: 'Bitcoin',
      ethereum: 'Ethereum',
      altcoins: 'Altcoins',
      crypto_index: 'Crypto Index',
      gold: 'Gold',
      silver: 'Silver',
      platinum: 'Platinum',
      oil: 'Oil',
      natural_gas: 'Natural Gas',
      agricultural: 'Agricultural',
      commodity_etf: 'Commodity ETF',
      residential_property: 'Residential Property',
      commercial_property: 'Commercial Property',
      reits: 'REITs',
      real_estate_funds: 'Real Estate Funds',
      private_equity: 'Private Equity',
      hedge_funds: 'Hedge Funds',
      venture_capital: 'Venture Capital',
      collectibles: 'Collectibles',
      art: 'Art & Antiques',
      savings_account: 'Savings Account',
      cd: 'Certificate of Deposit',
      money_market: 'Money Market',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const getPerformanceColor = (currentValue: number, purchaseValue: number) => {
    const gain = currentValue - purchaseValue;
    if (gain > 0) return 'text-green-600';
    if (gain < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPerformanceIcon = (currentValue: number, purchaseValue: number) => {
    const gain = currentValue - purchaseValue;
    if (gain > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (gain < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <LineChart className="w-4 h-4 text-gray-600" />;
  };

  const calculateGainPercentage = (investment: Investment) => {
    if (investment.purchaseValue === 0) return 0;
    return ((investment.currentValue - investment.purchaseValue) / investment.purchaseValue) * 100;
  };

  const handleAddSampleData = async () => {
    const sampleInvestments = [
      {
        name: 'Apple Inc.',
        type: 'stocks' as const,
        platform: 'Robinhood',
        currentValue: 15000,
        purchaseValue: 12000,
        shares: 100,
        purchaseDate: '2024-01-15',
        symbol: 'AAPL',
        color: '#1f77b4',
        description: 'Technology stock investment'
      },
      {
        name: 'Bitcoin',
        type: 'bitcoin' as const,
        platform: 'Coinbase',
        currentValue: 8500,
        purchaseValue: 10000,
        shares: 0.2,
        purchaseDate: '2023-11-20',
        symbol: 'BTC',
        color: '#ff7f0e',
        description: 'Cryptocurrency investment'
      },
      {
        name: 'S&P 500 ETF',
        type: 'etf' as const,
        platform: 'Vanguard',
        currentValue: 25000,
        purchaseValue: 22000,
        shares: 50,
        purchaseDate: '2023-06-10',
        symbol: 'VOO',
        color: '#2ca02c',
        description: 'Diversified market ETF'
      }
    ];

    for (const investment of sampleInvestments) {
      await addInvestment(investment);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <LineChart className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Investments
            </h1>
            <p className="text-gray-600">
              Track and manage your investment portfolio
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Investment
        </Button>
      </div>

      {/* Investment Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Portfolio
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Value</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
          </div>
        </Card>

        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${stats.totalGains >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {stats.totalGains >= 0 ? 
                <TrendingUp className="w-6 h-6 text-green-600" /> :
                <TrendingDown className="w-6 h-6 text-red-600" />
              }
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              stats.totalGains >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {stats.totalGains >= 0 ? 'Gain' : 'Loss'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Gains/Losses</p>
            <p className={`text-2xl font-bold ${getPerformanceColor(stats.totalValue, stats.totalValue - stats.totalGains)}`}>
              {formatCurrency(stats.totalGains)}
            </p>
          </div>
        </Card>

        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${stats.totalGainsPercentage >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <BarChart3 className={`w-6 h-6 ${stats.totalGainsPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              stats.totalGainsPercentage >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {stats.totalGainsPercentage >= 0 ? '+' : ''}{stats.totalGainsPercentage.toFixed(1)}%
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Return Percentage</p>
            <p className={`text-2xl font-bold ${getPerformanceColor(stats.totalValue, stats.totalValue - stats.totalGains)}`}>
              {stats.totalGainsPercentage >= 0 ? '+' : ''}{stats.totalGainsPercentage.toFixed(2)}%
            </p>
          </div>
        </Card>

        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              Holdings
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Investments</p>
            <p className="text-2xl font-bold text-gray-900">{investments.length}</p>
          </div>
        </Card>
      </div>

      {/* Investments List */}
      <Card className="bg-white shadow-lg border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-100 rounded-lg">
                <LineChart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Investment Portfolio</h3>
                <p className="text-sm text-gray-600">Your current investment holdings</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh Values
            </Button>
          </div>
          
          <div className="space-y-4">
            {investments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <LineChart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">No investments tracked</h3>
                <p className="text-sm">Add your investments to track their performance and value</p>
                <div className="mt-6">
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Investment
                  </Button>
                </div>
              </div>
            ) : (
              investments.map((investment) => {
                const gainPercentage = calculateGainPercentage(investment);
                const gain = investment.currentValue - investment.purchaseValue;
                
                return (
                  <div
                    key={investment.id}
                    className="group p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2.5 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${investment.color}20`, color: investment.color }}
                        >
                          {getInvestmentTypeIcon(investment.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {investment.name}
                            </h4>
                            {investment.symbol && (
                              <Badge variant="outline" className="text-xs">
                                {investment.symbol}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="truncate">{investment.platform}</span>
                            <Badge variant="outline" className="text-xs">
                              {getInvestmentTypeLabel(investment.type)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteInvestment(investment.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Investment Details */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <DollarSign className="w-3 h-3" />
                            <span>Current Value</span>
                          </div>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(investment.currentValue)}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <span>Purchase Value</span>
                          </div>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(investment.purchaseValue)}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            {getPerformanceIcon(investment.currentValue, investment.purchaseValue)}
                            <span>Gain/Loss</span>
                          </div>
                          <p className={`font-medium ${getPerformanceColor(investment.currentValue, investment.purchaseValue)}`}>
                            {formatCurrency(gain)} ({gainPercentage >= 0 ? '+' : ''}{gainPercentage.toFixed(2)}%)
                          </p>
                        </div>

                        {investment.shares && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>Shares</span>
                            </div>
                            <p className="font-medium text-gray-900">
                              {investment.shares.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {investment.description && (
                        <p className="text-sm text-gray-600 mt-2">{investment.description}</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Card>

      <AddInvestmentDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  );
}