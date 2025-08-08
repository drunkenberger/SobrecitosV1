import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { useTranslation } from 'react-i18next';

interface AddInvestmentDialogProps {
  open: boolean;
  onClose: () => void;
}

const investmentTypes = [
  { value: 'stocks', label: 'Stocks', category: 'Equities' },
  { value: 'etf', label: 'ETFs', category: 'Equities' },
  { value: 'mutual_funds', label: 'Mutual Funds', category: 'Equities' },
  { value: 'index_funds', label: 'Index Funds', category: 'Equities' },
  
  { value: 'government_bonds', label: 'Government Bonds', category: 'Fixed Income' },
  { value: 'corporate_bonds', label: 'Corporate Bonds', category: 'Fixed Income' },
  { value: 'municipal_bonds', label: 'Municipal Bonds', category: 'Fixed Income' },
  { value: 'treasury_bills', label: 'Treasury Bills', category: 'Fixed Income' },
  
  { value: 'bitcoin', label: 'Bitcoin', category: 'Cryptocurrency' },
  { value: 'ethereum', label: 'Ethereum', category: 'Cryptocurrency' },
  { value: 'altcoins', label: 'Altcoins', category: 'Cryptocurrency' },
  { value: 'crypto_index', label: 'Crypto Index Funds', category: 'Cryptocurrency' },
  
  { value: 'gold', label: 'Gold', category: 'Commodities' },
  { value: 'silver', label: 'Silver', category: 'Commodities' },
  { value: 'platinum', label: 'Platinum', category: 'Commodities' },
  { value: 'oil', label: 'Oil', category: 'Commodities' },
  { value: 'natural_gas', label: 'Natural Gas', category: 'Commodities' },
  { value: 'agricultural', label: 'Agricultural Products', category: 'Commodities' },
  { value: 'commodity_etf', label: 'Commodity ETFs', category: 'Commodities' },
  
  { value: 'residential_property', label: 'Residential Property', category: 'Real Estate' },
  { value: 'commercial_property', label: 'Commercial Property', category: 'Real Estate' },
  { value: 'reits', label: 'REITs', category: 'Real Estate' },
  { value: 'real_estate_funds', label: 'Real Estate Funds', category: 'Real Estate' },
  
  { value: 'private_equity', label: 'Private Equity', category: 'Alternative' },
  { value: 'hedge_funds', label: 'Hedge Funds', category: 'Alternative' },
  { value: 'venture_capital', label: 'Venture Capital', category: 'Alternative' },
  { value: 'collectibles', label: 'Collectibles', category: 'Alternative' },
  { value: 'art', label: 'Art & Antiques', category: 'Alternative' },
  
  { value: 'savings_account', label: 'Savings Account', category: 'Cash & Cash Equivalents' },
  { value: 'cd', label: 'Certificate of Deposit', category: 'Cash & Cash Equivalents' },
  { value: 'money_market', label: 'Money Market Funds', category: 'Cash & Cash Equivalents' },
  
  { value: 'other', label: 'Other', category: 'Other' }
];

const investmentColors = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
];

export default function AddInvestmentDialog({ open, onClose }: AddInvestmentDialogProps) {
  const { t } = useTranslation();
  const { addInvestment } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'stocks' as const,
    platform: '',
    currentValue: '',
    purchaseValue: '',
    shares: '',
    purchaseDate: '',
    symbol: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addInvestment({
        name: formData.name,
        type: formData.type,
        platform: formData.platform,
        currentValue: parseFloat(formData.currentValue) || 0,
        purchaseValue: parseFloat(formData.purchaseValue) || 0,
        shares: formData.shares ? parseFloat(formData.shares) : undefined,
        purchaseDate: formData.purchaseDate,
        symbol: formData.symbol || undefined,
        description: formData.description || undefined,
        color: investmentColors[Math.floor(Math.random() * investmentColors.length)]
      });

      // Reset form
      setFormData({
        name: '',
        type: 'stocks',
        platform: '',
        currentValue: '',
        purchaseValue: '',
        shares: '',
        purchaseDate: '',
        symbol: '',
        description: ''
      });

      onClose();
    } catch (error) {
      console.error('Failed to add investment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Investment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Investment Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Apple Inc., Bitcoin"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select investment type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(
                  investmentTypes.reduce((acc, type) => {
                    if (!acc[type.category]) acc[type.category] = [];
                    acc[type.category].push(type);
                    return acc;
                  }, {} as Record<string, typeof investmentTypes>)
                ).map(([category, types]) => (
                  <div key={category}>
                    <div className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50">
                      {category}
                    </div>
                    {types.map(type => (
                      <SelectItem key={type.value} value={type.value} className="pl-4">
                        {type.label}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Platform *</Label>
            <Input
              id="platform"
              value={formData.platform}
              onChange={(e) => handleChange('platform', e.target.value)}
              placeholder="e.g., Robinhood, Coinbase, Vanguard"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseValue">Purchase Value *</Label>
              <Input
                id="purchaseValue"
                type="number"
                step="0.01"
                value={formData.purchaseValue}
                onChange={(e) => handleChange('purchaseValue', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value *</Label>
              <Input
                id="currentValue"
                type="number"
                step="0.01"
                value={formData.currentValue}
                onChange={(e) => handleChange('currentValue', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shares">Shares</Label>
              <Input
                id="shares"
                type="number"
                step="0.001"
                value={formData.shares}
                onChange={(e) => handleChange('shares', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                value={formData.symbol}
                onChange={(e) => handleChange('symbol', e.target.value)}
                placeholder="e.g., AAPL, BTC"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date *</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => handleChange('purchaseDate', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Adding...' : 'Add Investment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}