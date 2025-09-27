import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, XCircle, TrendingUp, Home, CreditCard, Car, GraduationCap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface LoanCriteria {
  income: number;
  creditScore: number;
  employment: string;
  debtToIncomeRatio: number;
  downPayment: number;
  loanAmount: number;
  employmentYears: number;
  existingLoans: number;
  bankingHistory: number;
}

interface LoanProduct {
  id: string;
  name: string;
  icon: React.ReactNode;
  minCreditScore: number;
  maxDebtToIncome: number;
  minIncome: number;
  minEmploymentYears: number;
  interestRateRange: [number, number];
  maxLoanAmount: number;
  minDownPayment?: number;
  description: string;
}

const loanProducts: LoanProduct[] = [
  {
    id: 'mortgage',
    name: 'Home Mortgage',
    icon: <Home className="h-4 w-4" />,
    minCreditScore: 620,
    maxDebtToIncome: 43,
    minIncome: 40000,
    minEmploymentYears: 2,
    interestRateRange: [6.5, 8.5],
    maxLoanAmount: 1000000,
    minDownPayment: 3,
    description: 'Traditional home purchase loan'
  },
  {
    id: 'auto',
    name: 'Auto Loan',
    icon: <Car className="h-4 w-4" />,
    minCreditScore: 580,
    maxDebtToIncome: 50,
    minIncome: 25000,
    minEmploymentYears: 1,
    interestRateRange: [4.5, 12.0],
    maxLoanAmount: 80000,
    description: 'Vehicle financing'
  },
  {
    id: 'personal',
    name: 'Personal Loan',
    icon: <TrendingUp className="h-4 w-4" />,
    minCreditScore: 600,
    maxDebtToIncome: 40,
    minIncome: 30000,
    minEmploymentYears: 1,
    interestRateRange: [8.0, 25.0],
    maxLoanAmount: 50000,
    description: 'Unsecured personal financing'
  },
  {
    id: 'credit_card',
    name: 'Credit Card',
    icon: <CreditCard className="h-4 w-4" />,
    minCreditScore: 550,
    maxDebtToIncome: 45,
    minIncome: 20000,
    minEmploymentYears: 0.5,
    interestRateRange: [15.0, 29.0],
    maxLoanAmount: 25000,
    description: 'Revolving credit line'
  },
  {
    id: 'student',
    name: 'Student Loan',
    icon: <GraduationCap className="h-4 w-4" />,
    minCreditScore: 0,
    maxDebtToIncome: 60,
    minIncome: 0,
    minEmploymentYears: 0,
    interestRateRange: [5.0, 10.0],
    maxLoanAmount: 200000,
    description: 'Educational financing'
  }
];

export const LoanApprovalTool: React.FC = () => {
  const [criteria, setCriteria] = useState<LoanCriteria>({
    income: 0,
    creditScore: 0,
    employment: '',
    debtToIncomeRatio: 0,
    downPayment: 0,
    loanAmount: 0,
    employmentYears: 0,
    existingLoans: 0,
    bankingHistory: 0
  });

  const [selectedLoanType, setSelectedLoanType] = useState('mortgage');

  const updateCriteria = useCallback((field: keyof LoanCriteria, value: number | string) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  }, []);

  const calculateApprovalLikelihood = useCallback((product: LoanProduct): {
    score: number;
    status: 'approved' | 'likely' | 'unlikely' | 'denied';
    reasons: string[];
    estimatedRate: number;
    maxApprovedAmount: number;
  } => {
    const reasons: string[] = [];
    let score = 0;
    const maxScore = 100;

    // Credit Score (30 points)
    if (criteria.creditScore >= product.minCreditScore + 100) {
      score += 30;
    } else if (criteria.creditScore >= product.minCreditScore + 50) {
      score += 25;
      reasons.push('Good credit score');
    } else if (criteria.creditScore >= product.minCreditScore) {
      score += 15;
      reasons.push('Minimum credit score met');
    } else {
      reasons.push(`Credit score below minimum (${product.minCreditScore})`);
    }

    // Debt-to-Income Ratio (25 points)
    if (criteria.debtToIncomeRatio <= product.maxDebtToIncome - 10) {
      score += 25;
    } else if (criteria.debtToIncomeRatio <= product.maxDebtToIncome) {
      score += 15;
      reasons.push('Debt-to-income at acceptable level');
    } else {
      reasons.push(`Debt-to-income too high (max ${product.maxDebtToIncome}%)`);
    }

    // Income (20 points)
    if (criteria.income >= product.minIncome * 2) {
      score += 20;
    } else if (criteria.income >= product.minIncome) {
      score += 15;
      reasons.push('Income meets minimum requirement');
    } else {
      reasons.push(`Income below minimum ($${product.minIncome.toLocaleString()})`);
    }

    // Employment History (15 points)
    if (criteria.employmentYears >= product.minEmploymentYears + 2) {
      score += 15;
    } else if (criteria.employmentYears >= product.minEmploymentYears) {
      score += 10;
      reasons.push('Employment history adequate');
    } else {
      reasons.push(`Employment history too short (min ${product.minEmploymentYears} years)`);
    }

    // Down Payment (10 points) - for applicable loans
    if (product.minDownPayment) {
      const downPaymentPercent = (criteria.downPayment / criteria.loanAmount) * 100;
      if (downPaymentPercent >= 20) {
        score += 10;
      } else if (downPaymentPercent >= product.minDownPayment) {
        score += 5;
        reasons.push('Down payment meets minimum');
      } else {
        reasons.push(`Down payment below minimum (${product.minDownPayment}%)`);
      }
    } else {
      score += 10; // Full points for loans without down payment requirement
    }

    // Determine status
    let status: 'approved' | 'likely' | 'unlikely' | 'denied';
    if (score >= 80) status = 'approved';
    else if (score >= 60) status = 'likely';
    else if (score >= 40) status = 'unlikely';
    else status = 'denied';

    // Estimate interest rate
    const baseRate = product.interestRateRange[0];
    const maxRate = product.interestRateRange[1];
    const rateRange = maxRate - baseRate;
    const rateAdjustment = ((100 - score) / 100) * rateRange;
    const estimatedRate = baseRate + rateAdjustment;

    // Calculate max approved amount
    const incomeMultiplier = product.id === 'mortgage' ? 4 : product.id === 'auto' ? 0.3 : 0.2;
    const maxByIncome = criteria.income * incomeMultiplier;
    const maxApprovedAmount = Math.min(maxByIncome, product.maxLoanAmount, criteria.loanAmount * 1.1);

    return {
      score: Math.round(score),
      status,
      reasons,
      estimatedRate: Math.round(estimatedRate * 100) / 100,
      maxApprovedAmount: Math.round(maxApprovedAmount)
    };
  }, [criteria]);

  const selectedProduct = loanProducts.find(p => p.id === selectedLoanType)!;
  const approvalResult = useMemo(() => 
    calculateApprovalLikelihood(selectedProduct), 
    [calculateApprovalLikelihood, selectedProduct]
  );

  const allApprovals = useMemo(() => 
    loanProducts.map(product => ({
      product,
      result: calculateApprovalLikelihood(product)
    })), 
    [calculateApprovalLikelihood]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600';
      case 'likely': return 'text-blue-600';
      case 'unlikely': return 'text-orange-600';
      case 'denied': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'likely': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'unlikely': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'denied': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const approvalChartData = allApprovals.map(({ product, result }) => ({
    name: product.name,
    score: result.score,
    rate: result.estimatedRate
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d'];

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Loan Approval Calculator
          </CardTitle>
          <CardDescription>
            Evaluate your eligibility for different types of loans and credit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="assessment" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assessment">Financial Assessment</TabsTrigger>
              <TabsTrigger value="results">Approval Results</TabsTrigger>
              <TabsTrigger value="comparison">Loan Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="income">Annual Income ($)</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="75000"
                      value={criteria.income || ''}
                      onChange={(e) => updateCriteria('income', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="creditScore">Credit Score</Label>
                    <Input
                      id="creditScore"
                      type="number"
                      placeholder="720"
                      min="300"
                      max="850"
                      value={criteria.creditScore || ''}
                      onChange={(e) => updateCriteria('creditScore', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="employment">Employment Type</Label>
                    <Select onValueChange={(value) => updateCriteria('employment', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time Employee</SelectItem>
                        <SelectItem value="part-time">Part-time Employee</SelectItem>
                        <SelectItem value="self-employed">Self-employed</SelectItem>
                        <SelectItem value="contract">Contract Worker</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="employmentYears">Years of Employment</Label>
                    <Input
                      id="employmentYears"
                      type="number"
                      placeholder="3"
                      step="0.5"
                      value={criteria.employmentYears || ''}
                      onChange={(e) => updateCriteria('employmentYears', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="debtToIncomeRatio">Current Debt-to-Income Ratio (%)</Label>
                    <Input
                      id="debtToIncomeRatio"
                      type="number"
                      placeholder="25"
                      max="100"
                      value={criteria.debtToIncomeRatio || ''}
                      onChange={(e) => updateCriteria('debtToIncomeRatio', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="loanAmount">Requested Loan Amount ($)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="300000"
                      value={criteria.loanAmount || ''}
                      onChange={(e) => updateCriteria('loanAmount', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="downPayment">Down Payment ($)</Label>
                    <Input
                      id="downPayment"
                      type="number"
                      placeholder="60000"
                      value={criteria.downPayment || ''}
                      onChange={(e) => updateCriteria('downPayment', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="existingLoans">Existing Monthly Loan Payments ($)</Label>
                    <Input
                      id="existingLoans"
                      type="number"
                      placeholder="500"
                      value={criteria.existingLoans || ''}
                      onChange={(e) => updateCriteria('existingLoans', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <div className="mb-4">
                <Label>Select Loan Type</Label>
                <Select value={selectedLoanType} onValueChange={setSelectedLoanType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {loanProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex items-center gap-2">
                          {product.icon}
                          {product.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {getStatusIcon(approvalResult.status)}
                        <span className={`text-2xl font-bold ${getStatusColor(approvalResult.status)}`}>
                          {approvalResult.status.charAt(0).toUpperCase() + approvalResult.status.slice(1)}
                        </span>
                      </div>
                      <Badge variant="outline">
                        {approvalResult.score}% Approval Score
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Approval Likelihood</span>
                          <span>{approvalResult.score}/100</span>
                        </div>
                        <Progress value={approvalResult.score} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground">Estimated Rate</div>
                          <div className="text-lg font-semibold">{approvalResult.estimatedRate}%</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Max Amount</div>
                          <div className="text-lg font-semibold">
                            ${approvalResult.maxApprovedAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {approvalResult.reasons.length > 0 && (
                        <div>
                          <div className="font-medium mb-2">Key Factors:</div>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {approvalResult.reasons.slice(0, 5).map((reason) => (
                              <li key={`reason-${reason}`} className="flex items-start gap-2">
                                <AlertCircle className="h-3 w-3 mt-1 flex-shrink-0" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-4">Approval Score Breakdown</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[{ name: 'Your Score', score: approvalResult.score, benchmark: 70 }]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="score" fill="hsl(var(--primary))" />
                          <Bar dataKey="benchmark" fill="hsl(var(--muted))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-4">Loan Product Comparison</h4>
                    <div className="space-y-3">
                      {allApprovals.map(({ product, result }) => (
                        <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            {product.icon}
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">{product.description}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(result.status)}
                              <span className={`font-medium ${getStatusColor(result.status)}`}>
                                {result.status}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {result.score}% • {result.estimatedRate}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-4">Approval Scores Overview</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={approvalChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="score"
                            label={({ name, score }) => `${name}: ${score}%`}
                          >
                            {approvalChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-accent/20">
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-4">Improvement Recommendations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium mb-2">To Improve Approval Chances:</div>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Improve credit score to 740+ for best rates</li>
                        <li>• Reduce debt-to-income ratio below 36%</li>
                        <li>• Maintain stable employment for 2+ years</li>
                        <li>• Save for larger down payment (20%+)</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium mb-2">Before Applying:</div>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Check credit report for errors</li>
                        <li>• Gather income documentation</li>
                        <li>• Research current market rates</li>
                        <li>• Consider pre-approval benefits</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};