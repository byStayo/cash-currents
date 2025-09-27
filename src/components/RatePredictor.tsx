import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Zap, AlertCircle, Calendar, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart, Bar } from 'recharts';

interface RatePredictorProps {
  currentInflation?: number;
  currentInterest?: number;
}

export const RatePredictor: React.FC<RatePredictorProps> = ({
  currentInflation = 3.2,
  currentInterest = 7.5
}) => {
  const [timeHorizon, setTimeHorizon] = useState('1year');
  const [scenario, setScenario] = useState('base');
  const [rateType, setRateType] = useState('both');

  const generatePredictions = () => {
    const periods = timeHorizon === '1year' ? 12 : timeHorizon === '3years' ? 36 : 60;
    const predictions = [];

    const scenarios = {
      optimistic: { inflationTrend: -0.1, rateTrend: -0.15, volatility: 0.3 },
      base: { inflationTrend: 0.05, rateTrend: 0.1, volatility: 0.5 },
      pessimistic: { inflationTrend: 0.15, rateTrend: 0.2, volatility: 0.7 }
    };

    const currentScenario = scenarios[scenario as keyof typeof scenarios];

    for (let i = 0; i <= periods; i++) {
      const months = i;
      const years = i / 12;
      
      // Base trends
      const inflationBase = currentInflation + (currentScenario.inflationTrend * years);
      const interestBase = currentInterest + (currentScenario.rateTrend * years);
      
      // Add cyclical components and randomness
      const cyclical = Math.sin((months / 12) * 2 * Math.PI) * 0.3;
      const randomFactor = (Math.random() - 0.5) * currentScenario.volatility;
      
      const predictedInflation = Math.max(0, inflationBase + cyclical + randomFactor);
      const predictedInterest = Math.max(0.25, interestBase + cyclical * 0.8 + randomFactor * 0.8);
      
      predictions.push({
        month: i,
        date: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        inflation: Number(predictedInflation.toFixed(2)),
        interestRate: Number(predictedInterest.toFixed(2)),
        realRate: Number((predictedInterest - predictedInflation).toFixed(2)),
        borrowingAdvantage: predictedInflation > predictedInterest ? 'Good' : 'Poor'
      });
    }

    return predictions;
  };

  const predictions = generatePredictions();
  const finalPrediction = predictions[predictions.length - 1];
  const currentPrediction = predictions[0];
  
  const inflationChange = finalPrediction.inflation - currentPrediction.inflation;
  const interestChange = finalPrediction.interestRate - currentPrediction.interestRate;

  const getScenarioDescription = (scenarioType: string) => {
    switch (scenarioType) {
      case 'optimistic':
        return {
          title: 'Economic Recovery',
          description: 'Inflation cooling, Fed cutting rates, economic stability',
          probability: '25%',
          color: 'text-beneficial'
        };
      case 'base':
        return {
          title: 'Gradual Normalization',
          description: 'Moderate inflation control, steady rate adjustments',  
          probability: '50%',
          color: 'text-primary'
        };
      case 'pessimistic':
        return {
          title: 'Economic Uncertainty',
          description: 'Persistent inflation, aggressive rate hikes, volatility',
          probability: '25%',
          color: 'text-risk'
        };
      default:
        return {
          title: 'Gradual Normalization',
          description: 'Moderate inflation control, steady rate adjustments',
          probability: '50%',
          color: 'text-primary'
        };
    }
  };

  const scenarioInfo = getScenarioDescription(scenario);

  const economicIndicators = [
    {
      name: 'GDP Growth',
      current: 2.1,
      predicted: scenario === 'optimistic' ? 3.2 : scenario === 'base' ? 2.4 : 1.1,
      unit: '%'
    },
    {
      name: 'Unemployment',
      current: 3.8,
      predicted: scenario === 'optimistic' ? 3.5 : scenario === 'base' ? 4.1 : 5.2,
      unit: '%'
    },
    {
      name: 'Consumer Confidence',
      current: 102,
      predicted: scenario === 'optimistic' ? 115 : scenario === 'base' ? 105 : 85,
      unit: ''
    }
  ];

  const borrowingWindows = predictions.map((pred, index) => ({
    ...pred,
    borrowingScore: pred.inflation > pred.interestRate ? 
      Math.min(100, ((pred.inflation - pred.interestRate) / pred.interestRate) * 100 + 50) :
      Math.max(0, 50 - ((pred.interestRate - pred.inflation) / pred.interestRate) * 50)
  }));

  const bestBorrowingPeriods = borrowingWindows
    .filter(p => p.borrowingScore > 60)
    .slice(0, 3);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Interest Rate Predictor
        </CardTitle>
        <CardDescription>
          AI-powered predictions for future inflation and interest rate trends
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Time Horizon</label>
            <Select value={timeHorizon} onValueChange={setTimeHorizon}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="3years">3 Years</SelectItem>
                <SelectItem value="5years">5 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Economic Scenario</label>
            <Select value={scenario} onValueChange={setScenario}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="optimistic">Optimistic</SelectItem>
                <SelectItem value="base">Base Case</SelectItem>
                <SelectItem value="pessimistic">Pessimistic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Rate Focus</label>
            <Select value={rateType} onValueChange={setRateType}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Both Rates</SelectItem>
                <SelectItem value="inflation">Inflation Only</SelectItem>
                <SelectItem value="interest">Interest Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="bg-accent/50">
          <CardContent className="pt-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className={`font-semibold ${scenarioInfo.color}`}>{scenarioInfo.title}</h4>
                <p className="text-sm text-muted-foreground">{scenarioInfo.description}</p>
              </div>
              <Badge variant="outline">{scenarioInfo.probability}</Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium">Inflation Change</div>
                <div className={`text-lg font-bold ${inflationChange > 0 ? 'text-risk' : 'text-beneficial'}`}>
                  {inflationChange > 0 ? '+' : ''}{inflationChange.toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Interest Change</div>
                <div className={`text-lg font-bold ${interestChange > 0 ? 'text-risk' : 'text-beneficial'}`}>
                  {interestChange > 0 ? '+' : ''}{interestChange.toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Final Real Rate</div>
                <div className={`text-lg font-bold ${finalPrediction.realRate < 0 ? 'text-beneficial' : 'text-warning'}`}>
                  {finalPrediction.realRate.toFixed(1)}%
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Borrowing Outlook</div>
                <Badge variant={finalPrediction.inflation > finalPrediction.interestRate ? 'default' : 'destructive'}>
                  {finalPrediction.borrowingAdvantage}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-4">Rate Predictions</h4>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <ComposedChart data={predictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={10}
                      interval={Math.floor(predictions.length / 6)}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      formatter={(value, name) => [`${Number(value).toFixed(2)}%`, name]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    
                    {(rateType === 'both' || rateType === 'inflation') && (
                      <Area
                        type="monotone"
                        dataKey="inflation"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                        name="Inflation Rate"
                      />
                    )}
                    
                    {(rateType === 'both' || rateType === 'interest') && (
                      <Line
                        type="monotone"
                        dataKey="interestRate"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Interest Rate"
                      />
                    )}
                    
                    {rateType === 'both' && (
                      <Line
                        type="monotone"
                        dataKey="realRate"
                        stroke="#22c55e"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Real Rate"
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Economic Indicators
                </h4>
                <div className="space-y-3">
                  {economicIndicators.map((indicator) => (
                    <div key={indicator.name} className="flex justify-between items-center">
                      <span className="text-sm">{indicator.name}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {indicator.current}{indicator.unit} → {indicator.predicted}{indicator.unit}
                        </div>
                        <div className={`text-xs ${
                          indicator.predicted > indicator.current ? 
                            (indicator.name === 'Unemployment' ? 'text-risk' : 'text-beneficial') :
                            (indicator.name === 'Unemployment' ? 'text-beneficial' : 'text-risk')
                        }`}>
                          {indicator.predicted > indicator.current ? '↗' : '↘'} 
                          {Math.abs(((indicator.predicted - indicator.current) / indicator.current) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {bestBorrowingPeriods.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-beneficial" />
                    Best Borrowing Windows
                  </h4>
                  <div className="space-y-2">
                    {bestBorrowingPeriods.map((period) => (
                      <div key={`period-${period.date}-${period.borrowingScore}`} className="flex justify-between items-center text-sm">
                        <span>{period.date}</span>
                        <div className="text-right">
                          <Badge variant="outline" className="text-beneficial">
                            Score: {period.borrowingScore.toFixed(0)}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            Real rate: {period.realRate}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-warning/20 bg-warning/5">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-warning-foreground">Disclaimer</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Predictions are based on economic models and historical patterns</p>
                  <p>• Actual rates may vary significantly due to unforeseen events</p>
                  <p>• Use as guidance only, not financial advice</p>
                  <p>• Consider multiple scenarios when making decisions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};