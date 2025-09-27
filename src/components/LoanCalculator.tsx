import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Calculator, DollarSign, Calendar, Percent } from 'lucide-react';

interface LoanCalculatorProps {
  currentInflation?: number;
  currentInterest?: number;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  currentInflation = 3.2,
  currentInterest = 7.5
}) => {
  const [loanAmount, setLoanAmount] = useState([250000]);
  const [interestRate, setInterestRate] = useState([currentInterest]);
  const [loanTerm, setLoanTerm] = useState([30]);
  const [downPayment, setDownPayment] = useState([50000]);

  const calculateMonthlyPayment = () => {
    const principal = loanAmount[0] - downPayment[0];
    const monthlyRate = interestRate[0] / 100 / 12;
    const numPayments = loanTerm[0] * 12;
    
    // Input validation
    if (principal <= 0) return 0;
    if (monthlyRate < 0) return 0;
    if (numPayments <= 0) return 0;
    
    if (monthlyRate === 0) return principal / numPayments;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return isNaN(monthlyPayment) || !isFinite(monthlyPayment) ? 0 : monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * loanTerm[0] * 12;
  const totalInterest = totalPayment - (loanAmount[0] - downPayment[0]);
  
  // Calculate inflation-adjusted real cost properly with validation
  const realInterestRate = ((1 + (interestRate[0] / 100)) / (1 + (currentInflation / 100))) - 1;
  const realMonthlyRate = realInterestRate / 12;
  const principal = loanAmount[0] - downPayment[0];
  const numPayments = loanTerm[0] * 12;
  
  // Real monthly payment in today's purchasing power with error handling
  let realMonthlyPayment = 0;
  if (principal > 0 && numPayments > 0) {
    if (realMonthlyRate === 0) {
      realMonthlyPayment = principal / numPayments;
    } else {
      const calculation = principal * (realMonthlyRate * Math.pow(1 + realMonthlyRate, numPayments)) / 
        (Math.pow(1 + realMonthlyRate, numPayments) - 1);
      realMonthlyPayment = isNaN(calculation) || !isFinite(calculation) ? monthlyPayment : calculation;
    }
  }

  // Log for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('LoanCalculator calculations:', {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      realMonthlyPayment: realMonthlyPayment.toFixed(2),
      realInterestRate: (realInterestRate * 100).toFixed(2) + '%'
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Loan Payment Calculator
        </CardTitle>
        <CardDescription>
          Calculate monthly payments and total costs for your loan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="loan-amount">Loan Amount: ${loanAmount[0].toLocaleString()}</Label>
              <Slider
                id="loan-amount"
                min={10000}
                max={1000000}
                step={5000}
                value={loanAmount}
                onValueChange={setLoanAmount}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="down-payment">Down Payment: ${downPayment[0].toLocaleString()}</Label>
              <Slider
                id="down-payment"
                min={0}
                max={loanAmount[0] * 0.5}
                step={1000}
                value={downPayment}
                onValueChange={setDownPayment}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="interest-rate">Interest Rate: {interestRate[0]}%</Label>
              <Slider
                id="interest-rate"
                min={1}
                max={15}
                step={0.1}
                value={interestRate}
                onValueChange={setInterestRate}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="loan-term">Loan Term: {loanTerm[0]} years</Label>
              <Slider
                id="loan-term"
                min={5}
                max={40}
                step={1}
                value={loanTerm}
                onValueChange={setLoanTerm}
                className="mt-2"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4" />
                    Monthly Payment
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ${monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Total Interest
                  </span>
                  <span className="text-lg font-semibold text-destructive">
                    ${totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Percent className="h-4 w-4" />
                    Total Payment
                  </span>
                  <span className="text-lg font-semibold">
                    ${totalPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-xs text-muted-foreground mb-1">
                    Real Monthly Payment (Today's Purchasing Power)*
                  </div>
                  <div className="text-sm font-medium">
                    ${Math.abs(realMonthlyPayment).toLocaleString('en-US', { maximumFractionDigits: 0 })}/month
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {realInterestRate < 0 ? 'Inflation benefit: ' + Math.abs(realInterestRate * 100).toFixed(2) + '%' : 'Real cost: ' + (realInterestRate * 100).toFixed(2) + '%'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Key Insights</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Principal borrowed: ${(loanAmount[0] - downPayment[0]).toLocaleString()}</div>
                <div>• Interest-to-principal ratio: {((totalInterest / (loanAmount[0] - downPayment[0])) * 100).toFixed(1)}%</div>
                <div>• Monthly payment as % of loan: {((monthlyPayment / loanAmount[0]) * 100).toFixed(2)}%</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};