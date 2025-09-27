import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface CreditScoreImpactProps {
  currentInflation?: number;
  currentInterest?: number;
}

export const CreditScoreImpact: React.FC<CreditScoreImpactProps> = ({
  currentInflation = 3.2,
  currentInterest = 7.5
}) => {
  const [currentScore, setCurrentScore] = useState([720]);
  const [creditUtilization, setCreditUtilization] = useState([25]);
  const [newLoanAmount, setNewLoanAmount] = useState([25000]);
  const [currentDebt, setCurrentDebt] = useState([15000]);

  const getCreditScoreRange = (score: number) => {
    if (score >= 800) return { range: 'Excellent', color: 'bg-beneficial', textColor: 'text-beneficial' };
    if (score >= 740) return { range: 'Very Good', color: 'bg-primary', textColor: 'text-primary' };
    if (score >= 670) return { range: 'Good', color: 'bg-warning', textColor: 'text-warning' };
    if (score >= 580) return { range: 'Fair', color: 'bg-warning', textColor: 'text-warning' };
    return { range: 'Poor', color: 'bg-risk', textColor: 'text-risk' };
  };

  const calculateScoreImpact = () => {
    const totalDebt = currentDebt[0] + newLoanAmount[0];
    const newUtilization = creditUtilization[0] + (newLoanAmount[0] / 1000); // Simplified calculation
    
    let scoreChange = 0;
    
    // Hard inquiry impact
    scoreChange -= 5;
    
    // Credit utilization impact
    if (newUtilization > 30) scoreChange -= 15;
    else if (newUtilization > 10) scoreChange -= 5;
    
    // Debt-to-income considerations
    if (newLoanAmount[0] > 50000) scoreChange -= 10;
    
    // Age of accounts (new account)
    scoreChange -= 3;
    
    return Math.max(scoreChange, -50); // Cap maximum decrease
  };

  const scoreImpact = calculateScoreImpact();
  const projectedScore = Math.max(300, Math.min(850, currentScore[0] + scoreImpact));
  const currentRange = getCreditScoreRange(currentScore[0]);
  const projectedRange = getCreditScoreRange(projectedScore);

  const getInterestRateByScore = (score: number) => {
    if (score >= 800) return currentInterest - 2;
    if (score >= 740) return currentInterest - 1;
    if (score >= 670) return currentInterest;
    if (score >= 580) return currentInterest + 2;
    return currentInterest + 5;
  };

  const currentRate = getInterestRateByScore(currentScore[0]);
  const projectedRate = getInterestRateByScore(projectedScore);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Credit Score Impact Analysis
        </CardTitle>
        <CardDescription>
          See how borrowing affects your credit score and future lending rates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-score">Current Credit Score: {currentScore[0]}</Label>
              <Slider
                id="current-score"
                min={300}
                max={850}
                step={5}
                value={currentScore}
                onValueChange={setCurrentScore}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="credit-utilization">Credit Utilization: {creditUtilization[0]}%</Label>
              <Slider
                id="credit-utilization"
                min={0}
                max={100}
                step={1}
                value={creditUtilization}
                onValueChange={setCreditUtilization}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="new-loan">New Loan Amount: ${newLoanAmount[0].toLocaleString()}</Label>
              <Slider
                id="new-loan"
                min={5000}
                max={100000}
                step={1000}
                value={newLoanAmount}
                onValueChange={setNewLoanAmount}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="current-debt">Current Debt: ${currentDebt[0].toLocaleString()}</Label>
              <Slider
                id="current-debt"
                min={0}
                max={50000}
                step={1000}
                value={currentDebt}
                onValueChange={setCurrentDebt}
                className="mt-2"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Current Score</div>
                      <div className="text-2xl font-bold">{currentScore[0]}</div>
                      <Badge variant="outline" className={currentRange.textColor}>
                        {currentRange.range}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Projected Score</div>
                      <div className="text-2xl font-bold flex items-center gap-2">
                        {projectedScore}
                        {scoreImpact < 0 ? (
                          <TrendingDown className="h-5 w-5 text-destructive" />
                        ) : scoreImpact > 0 ? (
                          <TrendingUp className="h-5 w-5 text-beneficial" />
                        ) : null}
                      </div>
                      <Badge variant="outline" className={projectedRange.textColor}>
                        {projectedRange.range}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Score Change</span>
                      <span className={scoreImpact < 0 ? 'text-destructive font-semibold' : 'text-beneficial font-semibold'}>
                        {scoreImpact > 0 ? '+' : ''}{scoreImpact} points
                      </span>
                    </div>
                    <Progress value={Math.max(0, 100 + (scoreImpact / 50) * 100)} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-xs text-muted-foreground">Current Rate</div>
                      <div className="text-lg font-semibold">{currentRate.toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Projected Rate</div>
                      <div className="text-lg font-semibold">{projectedRate.toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Impact Factors
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-risk rounded-full"></div>
                  <span>Hard inquiry: -5 points</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>Credit utilization change: {creditUtilization[0] > 30 ? '-15' : creditUtilization[0] > 10 ? '-5' : '0'} points</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>New account age: -3 points</span>
                </div>
                {newLoanAmount[0] > 50000 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-risk rounded-full"></div>
                    <span>Large loan impact: -10 points</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};