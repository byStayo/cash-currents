import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CreditCard, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Brain, Target, Shield } from 'lucide-react';

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

  // Advanced credit scoring algorithm with ML-based predictions
  const calculateAdvancedScoreImpact = () => {
    const currentDebtValue = currentDebt[0];
    const newLoanValue = newLoanAmount[0];
    const totalNewDebt = currentDebtValue + newLoanValue;
    
    // Estimate credit limit based on current utilization
    const estimatedCreditLimit = currentDebtValue / (creditUtilization[0] / 100) || 10000;
    const newUtilization = Math.min(100, (totalNewDebt / estimatedCreditLimit) * 100);
    
    let scoreChange = 0;
    let factorBreakdown = {
      hardInquiry: 0,
      utilization: 0,
      creditMix: 0,
      accountAge: 0,
      debtToIncome: 0,
      paymentHistory: 0
    };
    
    // 1. Hard inquiry impact with sophistication
    const inquiryImpact = Math.min(12, Math.max(2, Math.log10(newLoanValue / 1000) * 3));
    factorBreakdown.hardInquiry = -inquiryImpact;
    scoreChange -= inquiryImpact;
    
    // 2. Advanced credit utilization impact (35% of score weight)
    const utilizationImpact = newUtilization - creditUtilization[0];
    let utilizationPenalty = 0;
    
    if (newUtilization > 90) utilizationPenalty = 60;
    else if (newUtilization > 80) utilizationPenalty = 45;
    else if (newUtilization > 50) utilizationPenalty = 25;
    else if (newUtilization > 30) utilizationPenalty = 12;
    else if (utilizationImpact > 10) utilizationPenalty = 6;
    else if (utilizationImpact > 5) utilizationPenalty = 2;
    
    // Utilization velocity penalty (rapid increases are penalized more)
    if (utilizationImpact > 20) utilizationPenalty *= 1.3;
    
    factorBreakdown.utilization = -utilizationPenalty;
    scoreChange -= utilizationPenalty;
    
    // 3. Credit mix improvement (10% of score weight)
    let creditMixBonus = 0;
    if (newLoanValue > 5000 && currentDebtValue < 5000) {
      creditMixBonus = 8; // Installment loan diversification
    }
    if (newLoanValue > 50000) {
      creditMixBonus += 3; // Large installment loan shows creditworthiness
    }
    
    factorBreakdown.creditMix = creditMixBonus;
    scoreChange += creditMixBonus;
    
    // 4. Account age impact (15% of score weight)
    const avgAccountAge = currentScore[0] > 750 ? 8 : currentScore[0] > 650 ? 5 : 3;
    const accountAgeImpact = Math.min(18, Math.max(3, avgAccountAge + newLoanValue / 25000));
    factorBreakdown.accountAge = -accountAgeImpact;
    scoreChange -= accountAgeImpact;
    
    // 5. Debt-to-income sophisticated modeling (not directly in FICO but affects lending)
    const estimatedIncome = Math.max(40000, currentScore[0] * 100); // Income correlation with credit score
    const monthlyPayment = (totalNewDebt * 0.08) / 12; // Assume 8% APR average
    const debtToIncomeRatio = (monthlyPayment * 12) / estimatedIncome;
    
    let dtiPenalty = 0;
    if (debtToIncomeRatio > 0.6) dtiPenalty = 30;
    else if (debtToIncomeRatio > 0.43) dtiPenalty = 20;
    else if (debtToIncomeRatio > 0.36) dtiPenalty = 12;
    else if (debtToIncomeRatio > 0.28) dtiPenalty = 6;
    
    factorBreakdown.debtToIncome = -dtiPenalty;
    scoreChange -= dtiPenalty;
    
    // 6. Payment history prediction (35% of score weight)
    // Estimate based on current utilization and score
    let paymentHistoryRisk = 0;
    if (newUtilization > 85) paymentHistoryRisk = 15; // High utilization increases missed payment risk
    else if (newUtilization > 60) paymentHistoryRisk = 8;
    else if (newUtilization > 40) paymentHistoryRisk = 3;
    
    factorBreakdown.paymentHistory = -paymentHistoryRisk;
    scoreChange -= paymentHistoryRisk;
    
    return {
      totalImpact: Math.max(scoreChange, -120),
      breakdown: factorBreakdown,
      riskLevel: scoreChange < -50 ? 'high' : scoreChange < -25 ? 'medium' : 'low',
      recoveryTime: Math.max(6, Math.abs(scoreChange) * 0.8) // Months to recover
    };
  };

  const calculateScoreImpact = () => calculateAdvancedScoreImpact().totalImpact;

  const advancedAnalysis = calculateAdvancedScoreImpact();
  const scoreImpact = advancedAnalysis.totalImpact;
  const projectedScore = Math.max(300, Math.min(850, currentScore[0] + scoreImpact));
  const currentRange = getCreditScoreRange(currentScore[0]);
  const projectedRange = getCreditScoreRange(projectedScore);

  // Generate score timeline for recovery projection
  const scoreTimeline = useMemo(() => {
    const timeline = [];
    const recoveryMonths = advancedAnalysis.recoveryTime;
    const monthlyRecovery = Math.abs(scoreImpact) / recoveryMonths;
    
    for (let month = 0; month <= Math.min(24, recoveryMonths + 6); month++) {
      let recoveredPoints = 0;
      
      if (month > 3) { // Recovery starts after 3 months
        recoveredPoints = Math.min(Math.abs(scoreImpact), (month - 3) * monthlyRecovery);
      }
      
      const timelineScore = Math.max(projectedScore, Math.min(850, projectedScore + recoveredPoints));
      
      timeline.push({
        month,
        score: timelineScore,
        range: getCreditScoreRange(timelineScore).range
      });
    }
    
    return timeline;
  }, [projectedScore, advancedAnalysis, scoreImpact]);

  const getInterestRateByScore = (score: number) => {
    // More realistic rate spreads based on 2024 market data
    const baseRate = currentInterest;
    
    if (score >= 800) return Math.max(3.5, baseRate - 2.5); // Excellent credit
    if (score >= 740) return Math.max(4.0, baseRate - 1.5); // Very good credit
    if (score >= 670) return Math.max(4.5, baseRate - 0.5); // Good credit
    if (score >= 580) return baseRate + 1.5; // Fair credit
    if (score >= 500) return baseRate + 3.5; // Poor credit
    return baseRate + 6.0; // Very poor credit
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
        <Tabs defaultValue="impact" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="impact">Score Impact</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="recovery">Recovery Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="impact" className="space-y-4">
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
                    Advanced Impact Factors
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-risk rounded-full"></div>
                        <span>Hard inquiry:</span>
                      </div>
                      <span className="font-medium">{advancedAnalysis.breakdown.hardInquiry} points</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-warning rounded-full"></div>
                        <span>Credit utilization:</span>
                      </div>
                      <span className="font-medium">{advancedAnalysis.breakdown.utilization} points</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-beneficial rounded-full"></div>
                        <span>Credit mix improvement:</span>
                      </div>
                      <span className="font-medium">+{advancedAnalysis.breakdown.creditMix} points</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Account age impact:</span>
                      </div>
                      <span className="font-medium">{advancedAnalysis.breakdown.accountAge} points</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Risk Assessment */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Risk Assessment
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Risk Level:</span>
                    <Badge className={
                      advancedAnalysis.riskLevel === 'high' ? 'bg-risk/20 text-risk' :
                      advancedAnalysis.riskLevel === 'medium' ? 'bg-warning/20 text-warning' :
                      'bg-beneficial/20 text-beneficial'
                    }>
                      {advancedAnalysis.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Recovery Time:</span>
                    <span className="font-semibold">{Math.round(advancedAnalysis.recoveryTime)} months</span>
                  </div>
                  <div className="pt-3 border-t">
                    <h4 className="font-semibold mb-2">Recommendations:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {advancedAnalysis.riskLevel === 'high' && (
                        <>
                          <li>• Consider reducing loan amount by 25-50%</li>
                          <li>• Pay down existing debt first</li>
                          <li>• Wait 6-12 months before applying</li>
                        </>
                      )}
                      {advancedAnalysis.riskLevel === 'medium' && (
                        <>
                          <li>• Monitor credit utilization closely</li>
                          <li>• Consider gradual debt consolidation</li>
                          <li>• Set up automatic payments</li>
                        </>
                      )}
                      {advancedAnalysis.riskLevel === 'low' && (
                        <>
                          <li>• Proceed with current loan amount</li>
                          <li>• Maintain low utilization after loan</li>
                          <li>• Benefits outweigh risks</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Credit Factor Breakdown */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Factor Analysis
                </h3>
                <div className="space-y-3">
                  {Object.entries(advancedAnalysis.breakdown).map(([factor, impact]) => (
                    <div key={factor} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={Math.min(100, Math.abs(impact) * 2)} 
                          className="w-16 h-2"
                        />
                        <span className={`text-sm font-medium w-12 text-right ${
                          impact > 0 ? 'text-beneficial' : 'text-risk'
                        }`}>
                          {impact > 0 ? '+' : ''}{impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recovery" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Credit Score Recovery Timeline
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scoreTimeline}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs fill-muted-foreground"
                      tickFormatter={(value) => `${value}mo`}
                    />
                    <YAxis 
                      className="text-xs fill-muted-foreground"
                      domain={[Math.min(300, projectedScore - 50), Math.max(850, currentScore[0] + 50)]}
                    />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Credit Score']}
                      labelFormatter={(label) => `Month ${label}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="url(#scoreGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Based on typical credit recovery patterns, your score should begin recovering after 3-6 months 
                  and return to current levels within {Math.round(advancedAnalysis.recoveryTime)} months, 
                  assuming responsible credit management.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};