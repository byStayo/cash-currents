import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, Globe, Calculator } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number; // Rate to USD
  interestRate: number;
  inflationRate: number;
  volatility: number;
}

interface CurrencyExchangeProps {
  baseInflation: number;
  baseInterest: number;
}

const CurrencyExchange: React.FC<CurrencyExchangeProps> = ({
  baseInflation,
  baseInterest
}) => {
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [targetCurrency, setTargetCurrency] = useState<string>('EUR');
  const [loanAmount, setLoanAmount] = useState<number>(100000);

  // Mock currency data with realistic rates
  const currencies: Currency[] = useMemo(() => [
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      exchangeRate: 1.0,
      interestRate: baseInterest,
      inflationRate: baseInflation,
      volatility: 1.2
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      exchangeRate: 0.85,
      interestRate: 3.2,
      inflationRate: 2.8,
      volatility: 1.5
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      exchangeRate: 0.73,
      interestRate: 4.8,
      inflationRate: 3.1,
      volatility: 1.8
    },
    {
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
      exchangeRate: 110.0,
      interestRate: 0.5,
      inflationRate: 0.8,
      volatility: 2.1
    },
    {
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'C$',
      exchangeRate: 1.25,
      interestRate: 4.2,
      inflationRate: 2.9,
      volatility: 1.4
    },
    {
      code: 'AUD',
      name: 'Australian Dollar',
      symbol: 'A$',
      exchangeRate: 1.35,
      interestRate: 3.8,
      inflationRate: 3.2,
      volatility: 1.9
    },
    {
      code: 'CHF',
      name: 'Swiss Franc',
      symbol: 'CHF',
      exchangeRate: 0.88,
      interestRate: 1.2,
      inflationRate: 1.5,
      volatility: 1.0
    },
    {
      code: 'CNY',
      name: 'Chinese Yuan',
      symbol: '¥',
      exchangeRate: 6.8,
      interestRate: 3.9,
      inflationRate: 2.1,
      volatility: 2.3
    }
  ], [baseInflation, baseInterest]);

  const baseCurrencyData = currencies.find(c => c.code === baseCurrency) || currencies[0];
  const targetCurrencyData = currencies.find(c => c.code === targetCurrency) || currencies[1];

  // Cross-currency analysis with proper volatility modeling and correlation
  const crossCurrencyAnalysis = useMemo(() => {
    const baseAdvantage = baseCurrencyData.inflationRate - baseCurrencyData.interestRate;
    const targetAdvantage = targetCurrencyData.inflationRate - targetCurrencyData.interestRate;
    
    // Calculate correlation-adjusted exchange rate risk
    const volatilityDifference = Math.abs(targetCurrencyData.volatility - baseCurrencyData.volatility);
    const correlationFactor = 0.7; // Assume 70% correlation between currencies
    const adjustedVolatility = volatilityDifference * (1 - correlationFactor);
    
    // Risk premium for currency conversion (includes transaction costs)
    const currencyRiskPremium = adjustedVolatility * 0.3 + 0.25; // 0.25% base cost
    const adjustedTargetAdvantage = targetAdvantage - currencyRiskPremium;
    
    // Currency conversion with realistic spread
    const exchangeSpread = 0.005; // 0.5% spread typical for currency conversion
    const effectiveExchangeRate = targetCurrencyData.exchangeRate * (1 + exchangeSpread);
    const convertedAmount = loanAmount * effectiveExchangeRate;
    
    // Calculate expected future exchange rate using purchasing power parity
    const inflationDifferential = targetCurrencyData.inflationRate - baseCurrencyData.inflationRate;
    const expectedRateChange = inflationDifferential * 0.7; // PPP adjustment factor
    const futureExchangeRate = targetCurrencyData.exchangeRate * (1 + expectedRateChange / 100);
    
    return {
      baseAdvantage,
      targetAdvantage,
      adjustedTargetAdvantage,
      exchangeRateRisk: adjustedVolatility,
      convertedAmount,
      currencyRiskPremium,
      futureExchangeRate,
      expectedRateChange,
      recommendation: adjustedTargetAdvantage > baseAdvantage ? targetCurrency : baseCurrency
    };
  }, [baseCurrencyData, targetCurrencyData, loanAmount, baseCurrency, targetCurrency]);

  // Generate historical exchange rate data with proper correlation modeling
  const historicalData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      
      // More realistic exchange rate modeling
      const baseRate = targetCurrencyData.exchangeRate;
      const timeWeight = Math.exp(-i * 0.05); // Exponential decay for older data relevance
      
      // Use Box-Muller for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const normalRandom = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      
      const volatilityFactor = normalRandom * (targetCurrencyData.volatility / 100) * timeWeight;
      const trendFactor = (targetCurrencyData.inflationRate - baseCurrencyData.inflationRate) * 0.001 * i;
      const seasonalFactor = Math.sin((i / 12) * 2 * Math.PI) * 0.02;
      
      const rate = baseRate * (1 + volatilityFactor + trendFactor + seasonalFactor);
      
      // Interest rate modeling with economic correlation
      const economicCorrelation = 0.6; // Correlation between exchange rates and interest rates
      const baseInterestShock = normalRandom * 0.3 * timeWeight;
      const targetInterestShock = normalRandom * economicCorrelation * 0.3 * timeWeight;
      
      data.unshift({
        month: month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        rate: Math.max(0.1, rate),
        baseInterest: Math.max(0.1, baseCurrencyData.interestRate + baseInterestShock),
        targetInterest: Math.max(0.1, targetCurrencyData.interestRate + targetInterestShock)
      });
    }
    return data;
  }, [baseCurrencyData, targetCurrencyData]);

  const currencyComparison = currencies.map(currency => ({
    currency: currency.code,
    name: currency.name,
    advantage: currency.inflationRate - currency.interestRate,
    risk: currency.volatility,
    interestRate: currency.interestRate,
    inflationRate: currency.inflationRate
  }));

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Multi-Currency Analysis
        </CardTitle>
        <CardDescription>
          Cross-border borrowing opportunities and currency risks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Currency Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Base Currency</label>
            <Select value={baseCurrency} onValueChange={setBaseCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.symbol}</span>
                      <span>{currency.code}</span>
                      <span className="text-muted-foreground text-sm">- {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Currency</label>
            <Select value={targetCurrency} onValueChange={setTargetCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.symbol}</span>
                      <span>{currency.code}</span>
                      <span className="text-muted-foreground text-sm">- {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Loan Amount ({baseCurrencyData.symbol})</label>
            <Input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />
          </div>
        </div>

        <Tabs defaultValue="comparison" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-4">
            {/* Quick Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{baseCurrencyData.symbol}</span>
                  <h4 className="font-semibold">{baseCurrency} - {baseCurrencyData.name}</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate:</span>
                    <span className="font-medium">{baseCurrencyData.interestRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Inflation Rate:</span>
                    <span className="font-medium">{baseCurrencyData.inflationRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Net Advantage:</span>
                    <span className={`font-medium ${crossCurrencyAnalysis.baseAdvantage > 0 ? 'text-beneficial' : 'text-risk'}`}>
                      {crossCurrencyAnalysis.baseAdvantage > 0 ? '+' : ''}{crossCurrencyAnalysis.baseAdvantage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Volatility:</span>
                    <span className="font-medium">{baseCurrencyData.volatility.toFixed(1)}%</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{targetCurrencyData.symbol}</span>
                  <h4 className="font-semibold">{targetCurrency} - {targetCurrencyData.name}</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate:</span>
                    <span className="font-medium">{targetCurrencyData.interestRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Inflation Rate:</span>
                    <span className="font-medium">{targetCurrencyData.inflationRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Net Advantage:</span>
                    <span className={`font-medium ${crossCurrencyAnalysis.targetAdvantage > 0 ? 'text-beneficial' : 'text-risk'}`}>
                      {crossCurrencyAnalysis.targetAdvantage > 0 ? '+' : ''}{crossCurrencyAnalysis.targetAdvantage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Exchange Rate:</span>
                    <span className="font-medium">{targetCurrencyData.exchangeRate.toFixed(4)}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recommendation */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold mb-2">Recommendation</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on current rates and risk-adjusted returns, borrowing in{' '}
                    <span className="font-semibold text-foreground">{crossCurrencyAnalysis.recommendation}</span>{' '}
                    appears more favorable.
                  </p>
                </div>
                <Badge 
                  className={`${crossCurrencyAnalysis.recommendation === targetCurrency ? 'bg-beneficial/20 text-beneficial' : 'bg-primary/20 text-primary'}`}
                >
                  {crossCurrencyAnalysis.recommendation} Preferred
                </Badge>
              </div>
            </Card>

            {/* All Currencies Comparison */}
            <div className="h-80">
              <h4 className="font-semibold mb-4">Global Currency Comparison</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currencyComparison}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="currency" 
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      const labels = {
                        advantage: 'Net Advantage',
                        risk: 'Volatility Risk'
                      };
                      return [`${value.toFixed(2)}%`, labels[name as keyof typeof labels] || name];
                    }}
                    labelFormatter={(label) => `${label} Currency`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="advantage" fill="hsl(var(--beneficial))" name="advantage" />
                  <Bar dataKey="risk" fill="hsl(var(--risk))" name="risk" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="h-80">
              <h4 className="font-semibold mb-4">
                Exchange Rate & Interest Rate Trends ({baseCurrency}/{targetCurrency})
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis 
                    yAxisId="left"
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      const labels = {
                        rate: 'Exchange Rate',
                        baseInterest: `${baseCurrency} Interest`,
                        targetInterest: `${targetCurrency} Interest`
                      };
                      const unit = name === 'rate' ? '' : '%';
                      return [`${value.toFixed(3)}${unit}`, labels[name as keyof typeof labels] || name];
                    }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="rate" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                    name="rate"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="baseInterest" 
                    stroke="hsl(var(--beneficial))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="baseInterest"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="targetInterest" 
                    stroke="hsl(var(--risk))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="targetInterest"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-4 w-4" />
                <h4 className="font-semibold">Cross-Currency Loan Calculator</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h5 className="font-medium mb-2">{baseCurrency} Loan</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Loan Amount:</span>
                        <span className="font-medium">
                          {baseCurrencyData.symbol}{loanAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span className="font-medium">{baseCurrencyData.interestRate.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Payment (5yr):</span>
                        <span className="font-medium">
                          {baseCurrencyData.symbol}
                          {(loanAmount * (baseCurrencyData.interestRate / 100 / 12) * Math.pow(1 + baseCurrencyData.interestRate / 100 / 12, 60) / (Math.pow(1 + baseCurrencyData.interestRate / 100 / 12, 60) - 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h5 className="font-medium mb-2">{targetCurrency} Loan</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Loan Amount:</span>
                        <span className="font-medium">
                          {targetCurrencyData.symbol}{crossCurrencyAnalysis.convertedAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span className="font-medium">{targetCurrencyData.interestRate.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Payment (5yr):</span>
                        <span className="font-medium">
                          {targetCurrencyData.symbol}
                          {(crossCurrencyAnalysis.convertedAmount * (targetCurrencyData.interestRate / 100 / 12) * Math.pow(1 + targetCurrencyData.interestRate / 100 / 12, 60) / (Math.pow(1 + targetCurrencyData.interestRate / 100 / 12, 60) - 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 rounded-lg bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Exchange Rate Risk</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current volatility difference: <span className="font-medium">{crossCurrencyAnalysis.exchangeRateRisk.toFixed(1)}%</span>
                  <br />
                  Consider hedging strategies for loans above {baseCurrencyData.symbol}50,000.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CurrencyExchange;