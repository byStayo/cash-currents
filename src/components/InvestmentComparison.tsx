import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface InvestmentComparisonProps {
  currentInflation?: number;
  currentInterest?: number;
}

export const InvestmentComparison: React.FC<InvestmentComparisonProps> = ({
  currentInflation = 3.2,
  currentInterest = 7.5
}) => {
  const [availableAmount, setAvailableAmount] = useState([50000]);
  const [loanRate, setLoanRate] = useState([currentInterest]);
  const [investmentReturn, setInvestmentReturn] = useState([8.5]);
  const [timeHorizon, setTimeHorizon] = useState([10]);
  const [riskTolerance, setRiskTolerance] = useState('moderate');
  const [investmentType, setInvestmentType] = useState('stocks');

  const getInvestmentVariability = (type: string) => {
    const variability = {
      'savings': { min: 0.5, max: 2.0, description: 'High certainty, low returns' },
      'bonds': { min: 2.0, max: 6.0, description: 'Low risk, steady returns' },
      'stocks': { min: -20, max: 25, description: 'High risk, high potential returns' },
      'reits': { min: -15, max: 20, description: 'Real estate exposure, moderate risk' },
      'crypto': { min: -50, max: 100, description: 'Extremely volatile, speculative' }
    };
    return variability[type as keyof typeof variability] || variability.stocks;
  };

  const calculateScenarios = () => {
    const amount = availableAmount[0];
    const rate = loanRate[0] / 100;
    const expectedReturn = investmentReturn[0] / 100;
    const years = timeHorizon[0];
    const variability = getInvestmentVariability(investmentType);

    // Scenario 1: Pay down debt
    const debtPaydownValue = amount; // Immediate guaranteed return
    const debtPaydownBenefit = amount * rate * years; // Interest saved over time

    // Scenario 2: Invest the money
    const investmentValue = amount * Math.pow(1 + expectedReturn, years);
    const investmentGain = investmentValue - amount;

    // Risk scenarios for investment
    const conservativeReturn = amount * Math.pow(1 + (variability.min / 100), years);
    const optimisticReturn = amount * Math.pow(1 + (variability.max / 100), years);

    // Net comparison (investment return minus loan cost)
    const netReturn = investmentGain - (amount * rate * years);
    const breakEvenReturn = rate * 100; // Required return to break even

    // Risk-adjusted analysis
    const probabilityOfSuccess = expectedReturn > rate ? 0.65 : 0.35; // Simplified probability

    return {
      debtPaydown: {
        value: debtPaydownValue,
        benefit: debtPaydownBenefit,
        totalValue: amount + debtPaydownBenefit,
        guaranteedReturn: rate * 100
      },
      investment: {
        expectedValue: investmentValue,
        expectedGain: investmentGain,
        conservativeValue: conservativeReturn,
        optimisticValue: optimisticReturn,
        netReturn,
        breakEvenReturn,
        probabilityOfSuccess
      },
      recommendation: netReturn > 0 ? 'invest' : 'paydown',
      riskAdjusted: netReturn > 0 && probabilityOfSuccess > 0.6 ? 'invest' : 'paydown'
    };
  };

  const scenarios = calculateScenarios();
  const variability = getInvestmentVariability(investmentType);

  // Generate timeline data
  const timelineData = [];
  for (let year = 1; year <= timeHorizon[0]; year++) {
    const debtValue = availableAmount[0] + (availableAmount[0] * (loanRate[0] / 100) * year);
    const investmentExpected = availableAmount[0] * Math.pow(1 + (investmentReturn[0] / 100), year);
    const investmentConservative = availableAmount[0] * Math.pow(1 + (variability.min / 100), year);
    const investmentOptimistic = availableAmount[0] * Math.pow(1 + (variability.max / 100), year);

    timelineData.push({
      year,
      'Debt Paydown': debtValue,
      'Expected Investment': investmentExpected,
      'Conservative Case': investmentConservative,
      'Optimistic Case': investmentOptimistic
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Investment vs. Debt Paydown Analysis
        </CardTitle>
        <CardDescription>
          Compare investing surplus funds versus paying down existing debt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="available-amount">Available Amount: ${availableAmount[0].toLocaleString()}</Label>
              <Slider
                id="available-amount"
                min={5000}
                max={200000}
                step={5000}
                value={availableAmount}
                onValueChange={setAvailableAmount}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="loan-rate">Current Debt Rate: {loanRate[0]}%</Label>
              <Slider
                id="loan-rate"
                min={1}
                max={25}
                step={0.1}
                value={loanRate}
                onValueChange={setLoanRate}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="investment-return">Expected Investment Return: {investmentReturn[0]}%</Label>
              <Slider
                id="investment-return"
                min={1}
                max={20}
                step={0.1}
                value={investmentReturn}
                onValueChange={setInvestmentReturn}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="time-horizon">Time Horizon: {timeHorizon[0]} years</Label>
              <Slider
                id="time-horizon"
                min={1}
                max={30}
                step={1}
                value={timeHorizon}
                onValueChange={setTimeHorizon}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="investment-type">Investment Type</Label>
              <Select value={investmentType} onValueChange={setInvestmentType}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">High-Yield Savings</SelectItem>
                  <SelectItem value="bonds">Bond Index Fund</SelectItem>
                  <SelectItem value="stocks">Stock Market Index</SelectItem>
                  <SelectItem value="reits">Real Estate (REITs)</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
              <Select value={riskTolerance} onValueChange={setRiskTolerance}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <Badge 
                    variant={scenarios.recommendation === 'invest' ? 'default' : 'outline'}
                    className="mb-2"
                  >
                    {scenarios.recommendation === 'invest' ? 'Invest' : 'Pay Down Debt'}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Based on expected returns
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Debt Paydown Value</span>
                    <span className="font-bold text-green-600">
                      ${scenarios.debtPaydown.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Investment Expected</span>
                    <span className="font-bold text-primary">
                      ${scenarios.investment.expectedValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Net Advantage</span>
                    <div className="text-right">
                      <div className={`font-bold ${scenarios.investment.netReturn > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(scenarios.investment.netReturn).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {scenarios.investment.netReturn > 0 ? 'Investment advantage' : 'Debt paydown advantage'}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Break-even Rate</span>
                    <span className="text-sm font-medium">{scenarios.investment.breakEvenReturn.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Probability</span>
                    <Badge variant="outline">
                      {(scenarios.investment.probabilityOfSuccess * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/50">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Risk Analysis
                </h4>
                <div className="space-y-2 text-sm">
                  <div>Range: {variability.min}% to {variability.max}%</div>
                  <div className="text-xs text-muted-foreground">{variability.description}</div>
                  
                  <div className="pt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Conservative:</span>
                      <span>${scenarios.investment.conservativeValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Optimistic:</span>
                      <span>${scenarios.investment.optimisticValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {scenarios.riskAdjusted !== scenarios.recommendation && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">Risk Adjustment</span>
                  </div>
                  <div className="text-xs text-orange-700">
                    Consider debt paydown for guaranteed returns given your risk profile.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-4">Growth Comparison</h4>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                      <Line 
                        type="monotone" 
                        dataKey="Debt Paydown" 
                        stroke="#22c55e" 
                        strokeWidth={3}
                        strokeDasharray="5 5"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Expected Investment" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Conservative Case" 
                        stroke="#ef4444" 
                        strokeWidth={1}
                        strokeDasharray="2 2"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Optimistic Case" 
                        stroke="#10b981" 
                        strokeWidth={1}
                        strokeDasharray="2 2"
                      />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-4">Key Considerations</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Debt Paydown Pros:</div>
                      <div className="text-muted-foreground text-xs">Guaranteed return, reduced stress, improved credit</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Investment Pros:</div>
                      <div className="text-muted-foreground text-xs">Higher potential returns, compound growth, diversification</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium">Key Risks:</div>
                      <div className="text-muted-foreground text-xs">Market volatility, emotional decision-making, opportunity cost</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      * Analysis assumes {currentInflation}% inflation rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};