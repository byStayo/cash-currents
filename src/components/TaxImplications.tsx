import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, FileText, DollarSign, Percent, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface TaxImplicationsProps {
  currentInflation?: number;
  currentInterest?: number;
}

export const TaxImplications: React.FC<TaxImplicationsProps> = ({
  currentInflation = 3.2,
  currentInterest = 7.5
}) => {
  const [annualIncome, setAnnualIncome] = useState([75000]);
  const [filingStatus, setFilingStatus] = useState('single');
  const [loanAmount, setLoanAmount] = useState([300000]);
  const [loanType, setLoanType] = useState('mortgage');
  const [state, setState] = useState('federal-only');

  const getTaxBracket = (income: number, status: string) => {
    // 2024 Federal Tax Brackets - Updated for accuracy
    const brackets = {
      single: [
        { min: 0, max: 11000, rate: 10 },
        { min: 11000, max: 44725, rate: 12 },
        { min: 44725, max: 95375, rate: 22 },
        { min: 95375, max: 182050, rate: 24 },
        { min: 182050, max: 231250, rate: 32 },
        { min: 231250, max: 578125, rate: 35 },
        { min: 578125, max: Infinity, rate: 37 }
      ],
      married: [
        { min: 0, max: 22000, rate: 10 },
        { min: 22000, max: 89450, rate: 12 },
        { min: 89450, max: 190750, rate: 22 },
        { min: 190750, max: 364200, rate: 24 },
        { min: 364200, max: 462500, rate: 32 },
        { min: 462500, max: 693750, rate: 35 },
        { min: 693750, max: Infinity, rate: 37 }
      ]
    };

    const relevantBrackets = brackets[status as keyof typeof brackets] || brackets.single;
    for (const bracket of relevantBrackets) {
      if (income >= bracket.min && income < bracket.max) {
        return bracket.rate;
      }
    }
    return 37; // Top bracket
  };

  const calculateTaxSavings = () => {
    const taxBracket = getTaxBracket(annualIncome[0], filingStatus);
    const annualInterest = (loanAmount[0] * currentInterest) / 100;
    
    let deductibleInterest = 0;
    
    switch (loanType) {
      case 'mortgage':
        // Mortgage interest is fully deductible up to $750k loan (2024 rules)
        const mortgageCap = 750000;
        const cappedLoanAmount = Math.min(loanAmount[0], mortgageCap);
        deductibleInterest = (cappedLoanAmount * currentInterest) / 100;
        break;
      case 'business':
        // Business loans are generally fully deductible
        deductibleInterest = annualInterest;
        break;
      case 'investment':
        // Investment interest deduction is limited to net investment income
        const estimatedInvestmentIncome = annualIncome[0] * 0.05; // Simplified estimate
        deductibleInterest = Math.min(annualInterest, estimatedInvestmentIncome);
        break;
      case 'student':
        // Student loan interest deduction with income phase-out (2024 rules)
        const maxStudentDeduction = 2500;
        const phaseOutStart = filingStatus === 'married' ? 145000 : 70000;
        const phaseOutEnd = filingStatus === 'married' ? 175000 : 85000;
        
        if (annualIncome[0] >= phaseOutEnd) {
          deductibleInterest = 0;
        } else if (annualIncome[0] >= phaseOutStart) {
          const phaseOutRatio = (phaseOutEnd - annualIncome[0]) / (phaseOutEnd - phaseOutStart);
          deductibleInterest = Math.min(annualInterest, maxStudentDeduction * phaseOutRatio);
        } else {
          deductibleInterest = Math.min(annualInterest, maxStudentDeduction);
        }
        break;
      default:
        // Personal loans, credit cards, etc. are not deductible
        deductibleInterest = 0;
    }

    const federalTaxSavings = (deductibleInterest * taxBracket) / 100;
    const stateTaxSavings = state !== 'federal-only' ? (deductibleInterest * 5) / 100 : 0; // Simplified 5% state rate
    const totalTaxSavings = federalTaxSavings + stateTaxSavings;
    
    const effectiveRate = ((annualInterest - totalTaxSavings) / loanAmount[0]) * 100;
    const inflationAdjustedRate = effectiveRate - currentInflation;

    return {
      annualInterest,
      deductibleInterest,
      federalTaxSavings,
      stateTaxSavings,
      totalTaxSavings,
      effectiveRate,
      inflationAdjustedRate,
      taxBracket
    };
  };

  const taxData = calculateTaxSavings();

  const pieData = [
    { name: 'After-Tax Interest', value: taxData.annualInterest - taxData.totalTaxSavings, fill: '#ef4444' },
    { name: 'Tax Savings', value: taxData.totalTaxSavings, fill: '#22c55e' }
  ];

  const comparisonData = [
    {
      name: 'Nominal Rate',
      rate: currentInterest,
      cost: taxData.annualInterest
    },
    {
      name: 'After-Tax Rate',
      rate: taxData.effectiveRate,
      cost: taxData.annualInterest - taxData.totalTaxSavings
    },
    {
      name: 'Real Rate (Inflation-Adjusted)',
      rate: taxData.inflationAdjustedRate,
      cost: (taxData.annualInterest - taxData.totalTaxSavings) - (loanAmount[0] * currentInflation / 100)
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Tax Implications Analysis
        </CardTitle>
        <CardDescription>
          Calculate tax benefits and after-tax borrowing costs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="annual-income">Annual Income: ${annualIncome[0].toLocaleString()}</Label>
              <Slider
                id="annual-income"
                min={30000}
                max={500000}
                step={5000}
                value={annualIncome}
                onValueChange={setAnnualIncome}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="filing-status">Filing Status</Label>
              <Select value={filingStatus} onValueChange={setFilingStatus}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married Filing Jointly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="loan-amount-tax">Loan Amount: ${loanAmount[0].toLocaleString()}</Label>
              <Slider
                id="loan-amount-tax"
                min={10000}
                max={1000000}
                step={10000}
                value={loanAmount}
                onValueChange={setLoanAmount}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="loan-type">Loan Type</Label>
              <Select value={loanType} onValueChange={setLoanType}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="business">Business Loan</SelectItem>
                  <SelectItem value="investment">Investment Loan</SelectItem>
                  <SelectItem value="student">Student Loan</SelectItem>
                  <SelectItem value="personal">Personal Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="state-tax">Tax Jurisdiction</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="federal-only">Federal Only</SelectItem>
                  <SelectItem value="with-state">Federal + State</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-green-600">
                    ${taxData.totalTaxSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-muted-foreground">Annual Tax Savings</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tax Bracket</span>
                    <Badge variant="outline">{taxData.taxBracket}%</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Federal Savings</span>
                    <span className="font-medium">${taxData.federalTaxSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  </div>
                  
                  {state !== 'federal-only' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">State Savings</span>
                      <span className="font-medium">${taxData.stateTaxSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Effective Rate</span>
                    <span className="font-bold text-primary">{taxData.effectiveRate.toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Real Rate</span>
                    <span className={`font-bold ${taxData.inflationAdjustedRate < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                      {taxData.inflationAdjustedRate.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Deduction Limits</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>• Mortgage: Up to $750k loan amount</div>
                <div>• Student: Max $2,500, income limits apply</div>
                <div>• Investment: Limited to investment income</div>
                <div>• Business: Generally fully deductible</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-4">Interest Cost Breakdown</h4>
                <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`tax-cell-${entry.name}-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-4">Rate Comparison</h4>
                <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer>
                    <BarChart data={comparisonData}>
                      <XAxis dataKey="name" fontSize={10} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
                      <Bar dataKey="rate" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};