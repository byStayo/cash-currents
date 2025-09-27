import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface InvestmentOption {
  name: string;
  category: string;
  currentYield: number;
  inflationAdjustedYield: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  liquidity: 'High' | 'Medium' | 'Low';
  minimumInvestment: number;
  description: string;
  pros: string[];
  cons: string[];
  environmentalFactors: string[];
}

interface ArbitrageOpportunity {
  strategy: string;
  expectedReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  timeHorizon: string;
  description: string;
  steps: string[];
  marketConditions: string;
}

interface InvestmentArbitrageAnalyzerProps {
  currentInflation: number;
  currentInterest: number;
}

export const InvestmentArbitrageAnalyzer: React.FC<InvestmentArbitrageAnalyzerProps> = ({
  currentInflation,
  currentInterest
}) => {
  // Calculate various investment yields based on current market conditions
  const investmentOptions = useMemo((): InvestmentOption[] => {
    const baseRiskFreeRate = Math.max(currentInterest - 0.5, 0.1); // Treasury bills
    const corpBondPremium = 1.5 + (currentInflation > 4 ? 1 : 0); // Corporate bond risk premium
    const dividendYield = 2.5 + Math.max(0, 5 - currentInflation); // Dividend stocks adjust with inflation
    const realEstateYield = currentInflation + 2; // Real estate typically beats inflation
    const commodityYield = currentInflation * 1.2; // Commodities often outpace inflation
    const cryptoYield = 15 + Math.random() * 20 - 10; // Crypto volatility
    
    return [
      {
        name: 'High-Yield Savings Account',
        category: 'Cash Equivalents',
        currentYield: Math.max(currentInterest - 1, 0.1),
        inflationAdjustedYield: Math.max(currentInterest - 1, 0.1) - currentInflation,
        riskLevel: 'Low',
        liquidity: 'High',
        minimumInvestment: 0,
        description: 'FDIC insured savings with competitive rates',
        pros: ['No risk', 'High liquidity', 'FDIC insured'],
        cons: ['Low returns', 'Inflation risk'],
        environmentalFactors: ['Rising rates environment', 'Bank competition']
      },
      {
        name: 'Treasury Bills (3-month)',
        category: 'Government Bonds',
        currentYield: baseRiskFreeRate,
        inflationAdjustedYield: baseRiskFreeRate - currentInflation,
        riskLevel: 'Low',
        liquidity: 'Medium',
        minimumInvestment: 100,
        description: 'Short-term government securities',
        pros: ['Government backed', 'Low volatility', 'Tax advantages'],
        cons: ['Low returns', 'Interest rate risk'],
        environmentalFactors: ['Fed policy changes', 'Economic uncertainty']
      },
      {
        name: 'Corporate Bonds (Investment Grade)',
        category: 'Corporate Bonds',
        currentYield: baseRiskFreeRate + corpBondPremium,
        inflationAdjustedYield: (baseRiskFreeRate + corpBondPremium) - currentInflation,
        riskLevel: 'Medium',
        liquidity: 'Medium',
        minimumInvestment: 1000,
        description: 'High-quality corporate debt securities',
        pros: ['Higher yield than treasuries', 'Regular income', 'Diversification'],
        cons: ['Credit risk', 'Interest rate sensitivity', 'Duration risk'],
        environmentalFactors: ['Credit cycle', 'Corporate earnings', 'Rate environment']
      },
      {
        name: 'Dividend Aristocrats ETF',
        category: 'Equity',
        currentYield: dividendYield,
        inflationAdjustedYield: dividendYield - currentInflation,
        riskLevel: 'Medium',
        liquidity: 'High',
        minimumInvestment: 50,
        description: 'S&P 500 companies with 25+ years of dividend increases',
        pros: ['Dividend growth', 'Inflation hedge', 'Capital appreciation'],
        cons: ['Market volatility', 'Concentration risk', 'Dividend cuts possible'],
        environmentalFactors: ['Economic growth', 'Corporate profitability', 'Market sentiment']
      },
      {
        name: 'REITs (Real Estate)',
        category: 'Real Estate',
        currentYield: realEstateYield,
        inflationAdjustedYield: realEstateYield - currentInflation,
        riskLevel: 'Medium',
        liquidity: 'Medium',
        minimumInvestment: 100,
        description: 'Real estate investment trusts',
        pros: ['Inflation hedge', 'High dividends', 'Diversification'],
        cons: ['Interest rate sensitive', 'Property market risk', 'Management fees'],
        environmentalFactors: ['Property markets', 'Interest rates', 'Economic conditions']
      },
      {
        name: 'TIPS (Treasury Inflation-Protected Securities)',
        category: 'Government Bonds',
        currentYield: Math.max(currentInflation + 0.5, 1),
        inflationAdjustedYield: 0.5,
        riskLevel: 'Low',
        liquidity: 'Medium',
        minimumInvestment: 100,
        description: 'Inflation-protected government bonds',
        pros: ['Inflation protection', 'Government backed', 'Real return guaranteed'],
        cons: ['Lower nominal yields', 'Deflation risk', 'Tax complexity'],
        environmentalFactors: ['Inflation expectations', 'Real rate environment']
      },
      {
        name: 'Commodity ETFs',
        category: 'Commodities',
        currentYield: commodityYield,
        inflationAdjustedYield: commodityYield - currentInflation,
        riskLevel: 'High',
        liquidity: 'High',
        minimumInvestment: 50,
        description: 'Diversified commodity exposure',
        pros: ['Inflation hedge', 'Diversification', 'Crisis hedge'],
        cons: ['High volatility', 'No income', 'Storage costs'],
        environmentalFactors: ['Supply/demand', 'Geopolitical events', 'Currency movements']
      },
      {
        name: 'High-Yield Corporate Bonds',
        category: 'Corporate Bonds',
        currentYield: Math.max(currentInterest + 4, 6),
        inflationAdjustedYield: Math.max(currentInterest + 4, 6) - currentInflation,
        riskLevel: 'High',
        liquidity: 'Medium',
        minimumInvestment: 1000,
        description: 'Below investment grade corporate debt',
        pros: ['High current income', 'Capital appreciation potential'],
        cons: ['Default risk', 'Credit downgrades', 'Economic sensitivity'],
        environmentalFactors: ['Credit cycle', 'Economic conditions', 'Default rates']
      }
    ];
  }, [currentInflation, currentInterest]);

  // Identify arbitrage opportunities
  const arbitrageOpportunities = useMemo((): ArbitrageOpportunity[] => {
    const opportunities: ArbitrageOpportunity[] = [];
    
    // Carry Trade Opportunity
    if (currentInterest > 2) {
      opportunities.push({
        strategy: 'Cash-Bond Carry Trade',
        expectedReturn: Math.max(currentInterest - 0.5, 0) * 0.8,
        riskLevel: 'Low',
        timeHorizon: '3-12 months',
        description: 'Borrow at low rates, invest in higher-yielding bonds',
        steps: [
          'Identify low-cost borrowing (margin, HELOC, etc.)',
          'Invest in treasury bills or CDs at higher rates',
          'Monitor interest rate changes',
          'Close position when spread narrows'
        ],
        marketConditions: 'Rising rate environment with inverted yield curve'
      });
    }

    // Inflation Arbitrage
    if (currentInflation > currentInterest + 1) {
      opportunities.push({
        strategy: 'Inflation Arbitrage',
        expectedReturn: currentInflation - currentInterest - 0.5,
        riskLevel: 'Medium',
        timeHorizon: '1-5 years',
        description: 'Borrow fixed-rate debt, invest in inflation-protected assets',
        steps: [
          'Secure long-term fixed-rate loans',
          'Invest in TIPS, real estate, or commodities',
          'Let inflation erode debt value',
          'Benefit from asset appreciation'
        ],
        marketConditions: 'High inflation, low real interest rates'
      });
    }

    // REIT-Bond Spread
    const reitYield = investmentOptions.find(opt => opt.name.includes('REIT'))?.currentYield || 0;
    const bondYield = investmentOptions.find(opt => opt.name.includes('Corporate Bonds'))?.currentYield || 0;
    
    if (reitYield > bondYield + 2) {
      opportunities.push({
        strategy: 'REIT-Bond Yield Spread',
        expectedReturn: reitYield - bondYield - 1,
        riskLevel: 'Medium',
        timeHorizon: '1-3 years',
        description: 'Overweight REITs vs bonds when yield spread is attractive',
        steps: [
          'Compare REIT yields to corporate bond yields',
          'Overweight REITs when spread > 200bp',
          'Monitor interest rate changes',
          'Rebalance when spread normalizes'
        ],
        marketConditions: 'REIT overselling, attractive property fundamentals'
      });
    }

    // Tax Arbitrage
    opportunities.push({
      strategy: 'Municipal Bond Tax Arbitrage',
      expectedReturn: (currentInterest * 0.8 * (1 - 0.37)) * 100, // Tax-equivalent yield
      riskLevel: 'Low',
      timeHorizon: '1-10 years',
      description: 'Municipal bonds for high-tax-bracket investors',
      steps: [
        'Calculate tax-equivalent yield',
        'Compare to taxable alternatives',
        'Consider state tax benefits',
        'Evaluate credit quality'
      ],
      marketConditions: 'High tax brackets, stable municipal finances'
    });

    return opportunities;
  }, [currentInflation, currentInterest, investmentOptions]);

  // Sort investments by inflation-adjusted yield
  const sortedInvestments = [...investmentOptions].sort((a, b) => b.inflationAdjustedYield - a.inflationAdjustedYield);

  // Determine market environment
  const marketEnvironment = useMemo(() => {
    const realRate = currentInterest - currentInflation;
    
    if (currentInflation > 5) {
      return {
        type: 'High Inflation',
        description: 'Inflation eroding purchasing power',
        strategy: 'Focus on real assets: REITs, commodities, TIPS',
        color: 'text-orange-600'
      };
    } else if (realRate > 2) {
      return {
        type: 'High Real Rates',
        description: 'Attractive real returns available',
        strategy: 'Lock in high real yields: bonds, CDs, treasuries',
        color: 'text-green-600'
      };
    } else if (realRate < 0) {
      return {
        type: 'Negative Real Rates',
        description: 'Inflation exceeding interest rates',
        strategy: 'Borrow and invest in real assets',
        color: 'text-blue-600'
      };
    } else {
      return {
        type: 'Balanced Environment',
        description: 'Moderate inflation and interest rates',
        strategy: 'Diversified portfolio with quality assets',
        color: 'text-gray-600'
      };
    }
  }, [currentInflation, currentInterest]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Investment Arbitrage Analyzer
          </CardTitle>
          <CardDescription>
            Optimal investment strategies based on current inflation ({currentInflation.toFixed(1)}%) and interest rates ({currentInterest.toFixed(1)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Market Environment */}
            <div className={`p-4 rounded-lg border ${marketEnvironment.color} bg-gradient-to-r from-primary/5 to-beneficial/5`}>
              <h4 className="font-semibold mb-2">Current Market Environment: {marketEnvironment.type}</h4>
              <p className="text-sm mb-2">{marketEnvironment.description}</p>
              <p className="text-sm font-medium">Recommended Strategy: {marketEnvironment.strategy}</p>
            </div>

            {/* Real Rate Display */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{currentInterest.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Interest Rate</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-beneficial">{currentInflation.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Inflation Rate</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className={`text-2xl font-bold ${(currentInterest - currentInflation) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(currentInterest - currentInflation).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Real Interest Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Investment Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-beneficial" />
            Top Investment Recommendations
          </CardTitle>
          <CardDescription>Ranked by inflation-adjusted returns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedInvestments.slice(0, 5).map((investment, index) => (
              <div key={investment.name} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{index + 1}. {investment.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {investment.category}
                      </Badge>
                      <Badge className={`text-xs ${getRiskColor(investment.riskLevel)}`}>
                        {investment.riskLevel} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{investment.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-1">
                      {investment.inflationAdjustedYield > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`font-bold ${investment.inflationAdjustedYield > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {investment.inflationAdjustedYield.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">Real Return</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="font-medium">Current Yield:</span> {investment.currentYield.toFixed(1)}%
                  </div>
                  <div>
                    <span className="font-medium">Liquidity:</span> {investment.liquidity}
                  </div>
                  <div>
                    <span className="font-medium">Min Investment:</span> ${investment.minimumInvestment.toLocaleString()}
                  </div>
                </div>

                {index < 3 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-medium text-green-600">Pros:</span>
                        <ul className="mt-1 space-y-1">
                          {investment.pros.map((pro, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-red-600">Cons:</span>
                        <ul className="mt-1 space-y-1">
                          {investment.cons.map((con, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-red-600" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Arbitrage Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Active Arbitrage Opportunities
          </CardTitle>
          <CardDescription>Strategies to exploit current market inefficiencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {arbitrageOpportunities.map((opportunity, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-beneficial/5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{opportunity.strategy}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{opportunity.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-beneficial">
                      +{opportunity.expectedReturn.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Expected Return</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-xs">
                  <div>
                    <span className="font-medium">Risk Level:</span> 
                    <Badge className={`ml-2 ${getRiskColor(opportunity.riskLevel)}`}>
                      {opportunity.riskLevel}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Time Horizon:</span> {opportunity.timeHorizon}
                  </div>
                  <div>
                    <span className="font-medium">Market Conditions:</span> {opportunity.marketConditions}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <span className="font-medium text-sm">Implementation Steps:</span>
                  <ol className="mt-2 space-y-1 text-xs">
                    {opportunity.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-4 h-4 bg-primary text-white rounded-full text-xs flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Allocation Suggestion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Suggested Portfolio Allocation
          </CardTitle>
          <CardDescription>Based on current market conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Risk-based allocations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3 text-green-600">Conservative (Low Risk)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>High-Yield Savings</span>
                    <span>20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Treasury Bills</span>
                    <span>30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TIPS</span>
                    <span>25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investment Grade Bonds</span>
                    <span>25%</span>
                  </div>
                  <div className="mt-3 pt-2 border-t">
                    <div className="flex justify-between font-semibold">
                      <span>Expected Return:</span>
                      <span className="text-green-600">
                        {(sortedInvestments.slice(0, 4).reduce((acc, inv) => acc + inv.inflationAdjustedYield, 0) / 4).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3 text-yellow-600">Moderate (Balanced Risk)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Dividend Stocks</span>
                    <span>25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>REITs</span>
                    <span>20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Corporate Bonds</span>
                    <span>25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TIPS</span>
                    <span>15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commodities</span>
                    <span>15%</span>
                  </div>
                  <div className="mt-3 pt-2 border-t">
                    <div className="flex justify-between font-semibold">
                      <span>Expected Return:</span>
                      <span className="text-yellow-600">
                        {(sortedInvestments.slice(1, 6).reduce((acc, inv) => acc + inv.inflationAdjustedYield, 0) / 5).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3 text-red-600">Aggressive (High Risk)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>High-Yield Bonds</span>
                    <span>30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>REITs</span>
                    <span>25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commodities</span>
                    <span>20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dividend Stocks</span>
                    <span>15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash</span>
                    <span>10%</span>
                  </div>
                  <div className="mt-3 pt-2 border-t">
                    <div className="flex justify-between font-semibold">
                      <span>Expected Return:</span>
                      <span className="text-red-600">
                        {(sortedInvestments.filter(inv => inv.riskLevel === 'High' || inv.riskLevel === 'Medium')
                          .slice(0, 4).reduce((acc, inv) => acc + inv.inflationAdjustedYield, 0) / 4).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};