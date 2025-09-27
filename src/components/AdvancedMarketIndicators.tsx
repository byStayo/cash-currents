import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Globe, Activity, Zap, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
  const [realTimeData, setRealTimeData] = useState(true);
  const [marketRegime, setMarketRegime] = useState<'bull' | 'bear' | 'sideways'>('bull');
  
  // Advanced AI-driven market regime detection
  const detectMarketRegime = useMemo(() => {
    const vixLevel = 18.5;
    const termSpread = -0.1;
    const dxyTrend = 0.8;
    
    // Regime detection algorithm
    if (vixLevel > 25 && termSpread < -0.3) return 'bear';
    if (vixLevel < 15 && termSpread > 0.5) return 'bull';
    return 'sideways';
  }, []);

  // Dynamic yield curve with real-time simulation
  const yieldCurveData: YieldCurvePoint[] = useMemo(() => {
    const baseRates = [
      { maturity: '3M', yield: 4.8, months: 3 },
      { maturity: '6M', yield: 4.9, months: 6 },
      { maturity: '1Y', yield: 4.7, months: 12 },
      { maturity: '2Y', yield: 4.3, months: 24 },
      { maturity: '5Y', yield: 4.1, months: 60 },
      { maturity: '10Y', yield: 4.2, months: 120 },
      { maturity: '30Y', yield: 4.4, months: 360 }
    ];
    
    // Apply market regime adjustments
    const regimeAdjustment = marketRegime === 'bear' ? 0.3 : marketRegime === 'bull' ? -0.2 : 0;
    
    return baseRates.map(rate => ({
      ...rate,
      yield: Math.max(0.1, rate.yield + regimeAdjustment + (Math.random() - 0.5) * 0.1),
      impliedProbability: Math.exp(-rate.months / 120) * 100, // Default probability curve
      termPremium: Math.max(0, (rate.months - 12) / 100) // Term premium calculation
    }));
  }, [marketRegime]);

  // Credit spreads by rating
  const creditSpreads: CreditSpread[] = useMemo(() => [
    { grade: 'AAA', spread: 0.15, change: -0.02 },
    { grade: 'AA', spread: 0.35, change: 0.01 },
    { grade: 'A', spread: 0.65, change: 0.03 },
    { grade: 'BBB', spread: 1.25, change: 0.08 },
    { grade: 'BB', spread: 2.85, change: 0.15 },
    { grade: 'B', spread: 4.95, change: 0.25 }
  ], []);

  // Advanced economic indicators with AI-driven analysis
  const economicIndicators: MarketIndicator[] = useMemo(() => {
    const baseIndicators = [
      { name: 'Fed Funds Rate', base: 5.25, volatility: 0.05 },
      { name: 'VIX', base: 18.5, volatility: 2.3 },
      { name: 'Term Spread (10Y-2Y)', base: -0.1, volatility: 0.15 },
      { name: 'DXY', base: 103.2, volatility: 1.2 },
      { name: 'MOVE Index', base: 115.8, volatility: 8.5 },
      { name: 'Real Yield (10Y TIPS)', base: 1.8, volatility: 0.3 },
      { name: 'Credit Spread (HYG)', base: 4.2, volatility: 0.8 },
      { name: 'Implied Forward Rate', base: 4.8, volatility: 0.4 }
    ];

    return baseIndicators.map(indicator => {
      const change = (Math.random() - 0.5) * indicator.volatility * 2;
      const value = indicator.base + change;
      
      // Advanced status determination using multiple factors
      let status: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      if (indicator.name === 'VIX') {
        status = value < 20 ? 'bullish' : value > 30 ? 'bearish' : 'neutral';
      } else if (indicator.name === 'Term Spread (10Y-2Y)') {
        status = value > 0.5 ? 'bullish' : value < -0.3 ? 'bearish' : 'neutral';
      } else if (indicator.name === 'Credit Spread (HYG)') {
        status = value < 3.5 ? 'bullish' : value > 5.5 ? 'bearish' : 'neutral';
      } else {
        status = change > indicator.volatility * 0.3 ? 'bullish' : change < -indicator.volatility * 0.3 ? 'bearish' : 'neutral';
      }

      return {
        name: indicator.name,
        value: Math.round(value * 100) / 100,
        change: Math.round(change * 100) / 100,
        status,
        description: getIndicatorDescription(indicator.name),
        confidence: Math.min(100, Math.max(50, 80 + (Math.random() - 0.5) * 30))
      };
    });
  }, [realTimeData, marketRegime]);

  const getIndicatorDescription = (name: string): string => {
    const descriptions: Record<string, string> = {
      'Fed Funds Rate': 'Federal Reserve benchmark interest rate',
      'VIX': 'CBOE Volatility Index - "Fear Gauge"',
      'Term Spread (10Y-2Y)': 'Yield curve slope indicator',
      'DXY': 'US Dollar Index vs basket of currencies',
      'MOVE Index': 'Bond market volatility index',
      'Real Yield (10Y TIPS)': 'Inflation-protected Treasury yield',
      'Credit Spread (HYG)': 'High-yield bond spread over Treasuries',
      'Implied Forward Rate': 'Market-implied future interest rates'
    };
    return descriptions[name] || 'Economic indicator';
  };

  // Advanced market regime analysis
  const marketAnalysis = useMemo(() => {
    const vix = economicIndicators.find(i => i.name === 'VIX')?.value || 18.5;
    const termSpread = economicIndicators.find(i => i.name === 'Term Spread (10Y-2Y)')?.value || -0.1;
    const creditSpread = economicIndicators.find(i => i.name === 'Credit Spread (HYG)')?.value || 4.2;
    
    // Multi-factor regime detection
    const volatilityScore = vix > 25 ? -2 : vix < 15 ? 2 : 0;
    const yieldCurveScore = termSpread > 0.5 ? 2 : termSpread < -0.3 ? -2 : 0;
    const creditScore = creditSpread < 3.5 ? 2 : creditSpread > 5.5 ? -2 : 0;
    
    const totalScore = volatilityScore + yieldCurveScore + creditScore;
    const regime = totalScore > 2 ? 'bull' : totalScore < -2 ? 'bear' : 'sideways';
    
    return {
      regime,
      confidence: Math.min(95, Math.max(60, 75 + Math.abs(totalScore) * 5)),
      borrowingWindow: regime === 'bull' ? 'favorable' : regime === 'bear' ? 'cautious' : 'neutral',
      riskAdjustment: regime === 'bear' ? 1.5 : regime === 'bull' ? 0.8 : 1.0
    };
  }, [economicIndicators]);

  // Real-time data simulation
  useEffect(() => {
    if (!realTimeData) return;
    
    const interval = setInterval(() => {
      setMarketRegime(detectMarketRegime);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [realTimeData, detectMarketRegime]);

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
        {/* Market Regime Indicator */}
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <span className="font-semibold">AI Market Regime:</span>
              <Badge className={
                marketAnalysis.regime === 'bull' ? 'bg-beneficial/20 text-beneficial' :
                marketAnalysis.regime === 'bear' ? 'bg-risk/20 text-risk' :
                'bg-warning/20 text-warning'
              }>
                {marketAnalysis.regime.toUpperCase()} MARKET
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <Progress value={marketAnalysis.confidence} className="w-20 h-2" />
              <span className="text-sm font-medium">{marketAnalysis.confidence}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={realTimeData ? "default" : "outline"}
              size="sm"
              onClick={() => setRealTimeData(!realTimeData)}
              className="transition-all duration-200"
            >
              <Activity className="h-4 w-4 mr-1" />
              {realTimeData ? 'Live Data' : 'Static Data'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="yield-curve" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="yield-curve">Yield Curve</TabsTrigger>
            <TabsTrigger value="credit-spreads">Credit Spreads</TabsTrigger>
            <TabsTrigger value="indicators">Economic Indicators</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
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
                <Card key={indicator.name} className="p-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{indicator.name}</span>
                        <div className={`flex items-center gap-1 ${getStatusColor(indicator.status)}`}>
                          {getStatusIcon(indicator.status)}
                        </div>
                        {realTimeData && (
                          <Zap className="h-3 w-3 text-primary animate-pulse" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {indicator.description}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Confidence:</span>
                        <Progress value={indicator.confidence || 75} className="w-16 h-1" />
                        <span className="text-xs">{indicator.confidence || 75}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{indicator.value.toFixed(2)}</div>
                      <div className={`text-sm font-medium ${indicator.change > 0 ? 'text-risk' : 'text-beneficial'}`}>
                        {indicator.change > 0 ? '+' : ''}{indicator.change.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  {/* Real-time indicator animation */}
                  {realTimeData && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 animate-pulse" />
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Market Regime Analysis */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Market Analysis
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Current Regime:</span>
                    <Badge className={
                      marketAnalysis.regime === 'bull' ? 'bg-beneficial/20 text-beneficial' :
                      marketAnalysis.regime === 'bear' ? 'bg-risk/20 text-risk' :
                      'bg-warning/20 text-warning'
                    }>
                      {marketAnalysis.regime.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Borrowing Window:</span>
                    <span className={
                      marketAnalysis.borrowingWindow === 'favorable' ? 'text-beneficial font-semibold' :
                      marketAnalysis.borrowingWindow === 'cautious' ? 'text-risk font-semibold' :
                      'text-warning font-semibold'
                    }>
                      {marketAnalysis.borrowingWindow.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Risk Adjustment:</span>
                    <span className="font-semibold">{marketAnalysis.riskAdjustment}x</span>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      {marketAnalysis.regime === 'bull' && 
                        "Market conditions favor borrowing with lower risk premiums and stable credit conditions."
                      }
                      {marketAnalysis.regime === 'bear' && 
                        "Elevated volatility and credit stress suggest cautious borrowing with higher risk buffers."
                      }
                      {marketAnalysis.regime === 'sideways' && 
                        "Mixed signals indicate a neutral stance with standard risk considerations."
                      }
                    </p>
                  </div>
                </div>
              </Card>

              {/* Advanced Yield Curve Analytics */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Yield Curve Intelligence</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Curve Shape:</span>
                    <span className="font-medium">
                      {yieldCurveData[6].yield > yieldCurveData[0].yield ? 'Normal' : 'Inverted'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Inversion Risk:</span>
                    <span className="font-medium">
                      {yieldCurveData[6].yield - yieldCurveData[0].yield < 0 ? 'HIGH' : 'LOW'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Optimal Duration:</span>
                    <span className="font-medium">
                      {yieldCurveData.reduce((max, curr) => curr.yield > max.yield ? curr : max).maturity}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart data={yieldCurveData}>
                          <XAxis dataKey="months" scale="linear" />
                          <YAxis dataKey="yield" />
                          <Scatter dataKey="yield" fill="hsl(var(--primary))" />
                          <Tooltip 
                            formatter={(value: number) => [`${value}%`, 'Yield']}
                            labelFormatter={(value) => `${value} months`}
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Borrowing Recommendations */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI-Powered Borrowing Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-beneficial/10 rounded-lg border border-beneficial/20">
                  <h4 className="font-semibold text-beneficial mb-2">Short-Term (1-2Y)</h4>
                  <p className="text-sm text-muted-foreground">
                    {marketAnalysis.regime === 'bull' ? 'Favorable rates, consider locking in' : 
                     marketAnalysis.regime === 'bear' ? 'Wait for better conditions' : 'Neutral outlook'}
                  </p>
                </div>
                <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <h4 className="font-semibold text-warning mb-2">Medium-Term (2-5Y)</h4>
                  <p className="text-sm text-muted-foreground">
                    {yieldCurveData[4].yield < yieldCurveData[0].yield ? 'Curve inversion may benefit' : 'Standard considerations apply'}
                  </p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2">Long-Term (5Y+)</h4>
                  <p className="text-sm text-muted-foreground">
                    {marketAnalysis.regime === 'bull' ? 'Lock in current rates' : 'Monitor for opportunities'}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedMarketIndicators;