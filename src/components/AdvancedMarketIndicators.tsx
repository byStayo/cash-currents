import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MarketIndicator {
  name: string;
  value: number;
  change: number;
  status: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

interface YieldCurvePoint {
  maturity: string;
  yield: number;
  months: number;
}

interface CreditSpread {
  grade: string;
  spread: number;
  change: number;
}

const AdvancedMarketIndicators = () => {
  // Generate yield curve data (Treasury rates across maturities)
  const yieldCurveData: YieldCurvePoint[] = useMemo(() => [
    { maturity: '3M', yield: 4.8, months: 3 },
    { maturity: '6M', yield: 4.9, months: 6 },
    { maturity: '1Y', yield: 4.7, months: 12 },
    { maturity: '2Y', yield: 4.3, months: 24 },
    { maturity: '5Y', yield: 4.1, months: 60 },
    { maturity: '10Y', yield: 4.2, months: 120 },
    { maturity: '30Y', yield: 4.4, months: 360 }
  ], []);

  // Credit spreads by rating
  const creditSpreads: CreditSpread[] = useMemo(() => [
    { grade: 'AAA', spread: 0.15, change: -0.02 },
    { grade: 'AA', spread: 0.35, change: 0.01 },
    { grade: 'A', spread: 0.65, change: 0.03 },
    { grade: 'BBB', spread: 1.25, change: 0.08 },
    { grade: 'BB', spread: 2.85, change: 0.15 },
    { grade: 'B', spread: 4.95, change: 0.25 }
  ], []);

  // Economic indicators
  const economicIndicators: MarketIndicator[] = useMemo(() => [
    {
      name: 'Fed Funds Rate',
      value: 5.25,
      change: 0.25,
      status: 'neutral',
      description: 'Federal Reserve interest rate'
    },
    {
      name: 'VIX',
      value: 18.5,
      change: -2.3,
      status: 'bullish',
      description: 'Market volatility index'
    },
    {
      name: 'Term Spread (10Y-2Y)',
      value: -0.1,
      change: 0.05,
      status: 'bearish',
      description: 'Yield curve inversion indicator'
    },
    {
      name: 'DXY',
      value: 103.2,
      change: 0.8,
      status: 'bullish',
      description: 'US Dollar Index'
    },
    {
      name: 'MOVE Index',
      value: 115.8,
      change: -5.2,
      status: 'bullish',
      description: 'Bond market volatility'
    }
  ], []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bullish': return 'text-beneficial';
      case 'bearish': return 'text-risk';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'bullish': return <TrendingUp className="h-4 w-4" />;
      case 'bearish': return <TrendingDown className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Advanced Market Indicators
        </CardTitle>
        <CardDescription>
          Real-time market conditions affecting borrowing decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="yield-curve" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="yield-curve">Yield Curve</TabsTrigger>
            <TabsTrigger value="credit-spreads">Credit Spreads</TabsTrigger>
            <TabsTrigger value="indicators">Economic Indicators</TabsTrigger>
          </TabsList>

          <TabsContent value="yield-curve" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yieldCurveData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="maturity" 
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Yield']}
                    labelFormatter={(label) => `${label} Treasury`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="yield"
                    stroke="hsl(var(--primary))"
                    fill="url(#yieldGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Inverted curve signals potential recession</span>
              <Badge variant="secondary">Updated 5min ago</Badge>
            </div>
          </TabsContent>

          <TabsContent value="credit-spreads" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {creditSpreads.map((spread) => (
                <Card key={spread.grade} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{spread.grade}</div>
                      <div className="text-2xl font-bold">{spread.spread.toFixed(2)}%</div>
                    </div>
                    <div className={`flex items-center gap-1 ${spread.change > 0 ? 'text-risk' : 'text-beneficial'}`}>
                      {spread.change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="text-sm font-medium">
                        {spread.change > 0 ? '+' : ''}{spread.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              Credit spreads over Treasury rates by bond rating
            </div>
          </TabsContent>

          <TabsContent value="indicators" className="space-y-4">
            <div className="grid gap-4">
              {economicIndicators.map((indicator) => (
                <Card key={indicator.name} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{indicator.name}</span>
                        <div className={`flex items-center gap-1 ${getStatusColor(indicator.status)}`}>
                          {getStatusIcon(indicator.status)}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {indicator.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{indicator.value.toFixed(2)}</div>
                      <div className={`text-sm font-medium ${indicator.change > 0 ? 'text-risk' : 'text-beneficial'}`}>
                        {indicator.change > 0 ? '+' : ''}{indicator.change.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedMarketIndicators;