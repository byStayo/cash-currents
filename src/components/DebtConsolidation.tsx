import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, CreditCard, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Debt {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

interface DebtConsolidationProps {
  currentInflation?: number;
  currentInterest?: number;
}

export const DebtConsolidation: React.FC<DebtConsolidationProps> = ({
  currentInflation = 3.2,
  currentInterest = 7.5
}) => {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card 1', balance: 8500, rate: 18.9, minPayment: 250 },
    { id: '2', name: 'Credit Card 2', balance: 4200, rate: 22.5, minPayment: 125 },
    { id: '3', name: 'Personal Loan', balance: 12000, rate: 12.5, minPayment: 350 }
  ]);

  const [consolidationRate, setConsolidationRate] = useState(currentInterest);
  const [consolidationTerm, setConsolidationTerm] = useState(5);

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: `Debt ${debts.length + 1}`,
      balance: 1000,
      rate: 15,
      minPayment: 50
    };
    setDebts([...debts, newDebt]);
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  const calculateScenarios = () => {
    const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minPayment, 0);
    const weightedAvgRate = debts.reduce((sum, debt) => sum + (debt.rate * debt.balance), 0) / totalBalance;

    // Current scenario (minimum payments) - handle edge cases
    const currentTotalInterest = debts.reduce((sum, debt) => {
      const monthlyRate = debt.rate / 100 / 12;
      
      // Handle edge cases where payment might be too low or rate is zero
      if (monthlyRate === 0) {
        return sum + 0; // No interest if rate is 0
      }
      
      const monthlyInterest = debt.balance * monthlyRate;
      if (debt.minPayment <= monthlyInterest) {
        // Payment doesn't cover interest - use approximation for very long payoff
        const estimatedMonths = Math.min(600, debt.balance / (debt.minPayment * 0.1)); // Cap at 50 years
        return sum + (debt.minPayment * estimatedMonths - debt.balance);
      }
      
      const months = Math.log(1 + (debt.balance * monthlyRate) / debt.minPayment) / Math.log(1 + monthlyRate);
      const validMonths = Math.min(Math.max(months, 1), 600); // Between 1 month and 50 years
      return sum + (debt.minPayment * validMonths - debt.balance);
    }, 0);

    // Consolidation scenario - handle zero rate case
    const consolidationMonthlyRate = consolidationRate / 100 / 12;
    const consolidationMonths = consolidationTerm * 12;
    
    const consolidationPayment = consolidationMonthlyRate === 0 
      ? totalBalance / consolidationMonths
      : totalBalance * (consolidationMonthlyRate * Math.pow(1 + consolidationMonthlyRate, consolidationMonths)) / 
        (Math.pow(1 + consolidationMonthlyRate, consolidationMonths) - 1);
    
    const consolidationTotalInterest = (consolidationPayment * consolidationMonths) - totalBalance;

    // Savings calculation
    const interestSavings = currentTotalInterest - consolidationTotalInterest;
    const paymentDifference = totalMinPayments - consolidationPayment;

    return {
      current: {
        totalBalance,
        totalMinPayments,
        weightedAvgRate,
        totalInterest: currentTotalInterest
      },
      consolidated: {
        monthlyPayment: consolidationPayment,
        totalInterest: consolidationTotalInterest,
        rate: consolidationRate
      },
      savings: {
        interestSavings,
        paymentDifference,
        percentageSavings: (interestSavings / currentTotalInterest) * 100
      }
    };
  };

  const scenarios = calculateScenarios();

  const chartData = [
    {
      name: 'Current Debts',
      'Monthly Payment': scenarios.current.totalMinPayments,
      'Total Interest': scenarios.current.totalInterest,
      'Average Rate': scenarios.current.weightedAvgRate
    },
    {
      name: 'Consolidated',
      'Monthly Payment': scenarios.consolidated.monthlyPayment,
      'Total Interest': scenarios.consolidated.totalInterest,
      'Average Rate': scenarios.consolidated.rate
    }
  ];

  const payoffTimeline = () => {
    const timeline = [];
    for (let year = 1; year <= 10; year++) {
      // Calculate remaining balance for current strategy (individual debts)
      const currentRemaining = debts.reduce((sum, debt) => {
        const monthlyRate = debt.rate / 100 / 12;
        const months = year * 12;
        
        if (monthlyRate === 0) {
          // No interest case
          const remaining = Math.max(0, debt.balance - (debt.minPayment * months));
          return sum + remaining;
        }
        
        // Standard amortization formula for remaining balance
        const monthlyInterest = debt.balance * monthlyRate;
        if (debt.minPayment <= monthlyInterest) {
          // Payment barely covers interest - balance grows
          const remaining = debt.balance * Math.pow(1 + monthlyRate, months);
          return sum + remaining;
        }
        
        // Calculate remaining balance after payments
        const futureValue = debt.minPayment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        const compoundedBalance = debt.balance * Math.pow(1 + monthlyRate, months);
        const remaining = Math.max(0, compoundedBalance - futureValue);
        return sum + remaining;
      }, 0);

      // Calculate remaining balance for consolidated loan
      const consolidationMonthlyRate = consolidationRate / 100 / 12;
      const months = year * 12;
      
      let consolidatedRemaining = 0;
      if (consolidationMonthlyRate === 0) {
        // No interest case
        consolidatedRemaining = Math.max(0, scenarios.current.totalBalance - (scenarios.consolidated.monthlyPayment * months));
      } else {
        // Standard amortization for remaining balance
        const futureValue = scenarios.consolidated.monthlyPayment * ((Math.pow(1 + consolidationMonthlyRate, months) - 1) / consolidationMonthlyRate);
        const compoundedBalance = scenarios.current.totalBalance * Math.pow(1 + consolidationMonthlyRate, months);
        consolidatedRemaining = Math.max(0, compoundedBalance - futureValue);
      }

      timeline.push({
        year,
        'Current Strategy': currentRemaining,
        'Consolidated': consolidatedRemaining
      });
    }
    return timeline;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Debt Consolidation Analysis
        </CardTitle>
        <CardDescription>
          Compare multiple debts vs. consolidation loan scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Current Debts</h3>
              <Button onClick={addDebt} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Debt
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {debts.map((debt) => (
                <Card key={debt.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        value={debt.name}
                        onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                        className="font-medium"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDebt(debt.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Balance</Label>
                        <Input
                          type="number"
                          value={debt.balance}
                          onChange={(e) => updateDebt(debt.id, 'balance', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={debt.rate}
                          onChange={(e) => updateDebt(debt.id, 'rate', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Min Payment</Label>
                        <Input
                          type="number"
                          value={debt.minPayment}
                          onChange={(e) => updateDebt(debt.id, 'minPayment', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-4 bg-accent/50">
              <h4 className="font-semibold mb-3">Consolidation Loan Terms</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Interest Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={consolidationRate}
                    onChange={(e) => setConsolidationRate(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Term (years)</Label>
                  <Input
                    type="number"
                    value={consolidationTerm}
                    onChange={(e) => setConsolidationTerm(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      ${scenarios.current.totalMinPayments.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Monthly</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-beneficial">
                      ${scenarios.consolidated.monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-sm text-muted-foreground">Consolidated Monthly</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Balance</span>
                    <span className="font-medium">${scenarios.current.totalBalance.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Payment Difference</span>
                    <div className="flex items-center gap-2">
                      {scenarios.savings.paymentDifference > 0 ? (
                        <TrendingDown className="h-4 w-4 text-beneficial" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-destructive" />
                      )}
                      <span className={`font-medium ${scenarios.savings.paymentDifference > 0 ? 'text-beneficial' : 'text-destructive'}`}>
                        ${Math.abs(scenarios.savings.paymentDifference).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Interest Savings</span>
                    <div className="text-right">
                      <div className={`font-medium ${scenarios.savings.interestSavings > 0 ? 'text-beneficial' : 'text-destructive'}`}>
                        ${Math.abs(scenarios.savings.interestSavings).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.abs(scenarios.savings.percentageSavings).toFixed(1)}% {scenarios.savings.interestSavings > 0 ? 'savings' : 'more'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-4">Payment Comparison</h4>
                <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                      <Bar dataKey="Monthly Payment" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-4">Debt Payoff Timeline</h4>
                <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer>
                    <LineChart data={payoffTimeline()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                      <Line type="monotone" dataKey="Current Strategy" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="Consolidated" stroke="#22c55e" strokeWidth={2} />
                      <Legend />
                    </LineChart>
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