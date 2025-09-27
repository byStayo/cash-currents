import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, Calculator } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

interface Scenario {
  id: string;
  name: string;
  loanAmount: number;
  interestRate: number;
  termYears: number;
  purpose: string;
  taxDeductible: boolean;
  taxBracket: number;
  compoundFrequency: number;
}

interface ScenarioComparisonProps {
  currentInflation: number;
}

const ScenarioComparison = ({ currentInflation }: ScenarioComparisonProps) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: "1",
      name: "Home Purchase",
      loanAmount: 500000,
      interestRate: 6.5,
      termYears: 30,
      purpose: "Real Estate",
      taxDeductible: true,
      taxBracket: 22,
      compoundFrequency: 12
    }
  ]);

  const [newScenario, setNewScenario] = useState<Omit<Scenario, "id">>({
    name: "",
    loanAmount: 0,
    interestRate: 0,
    termYears: 0,
    purpose: "Real Estate",
    taxDeductible: false,
    taxBracket: 22,
    compoundFrequency: 12
  });

  const calculateScenarioMetrics = (scenario: Scenario) => {
    // Enhanced compound interest calculation
    const periodsPerYear = scenario.compoundFrequency;
    const periodicRate = scenario.interestRate / 100 / periodsPerYear;
    const totalPeriods = scenario.termYears * periodsPerYear;
    
    // Calculate monthly payment using compound interest formula
    const monthlyPayment = scenario.loanAmount * 
      (periodicRate * Math.pow(1 + periodicRate, totalPeriods)) / 
      (Math.pow(1 + periodicRate, totalPeriods) - 1);
    
    const totalInterest = (monthlyPayment * totalPeriods) - scenario.loanAmount;
    
    // Tax-adjusted calculations
    const effectiveInterestRate = scenario.taxDeductible 
      ? scenario.interestRate * (1 - scenario.taxBracket / 100)
      : scenario.interestRate;
    
    const taxSavings = scenario.taxDeductible 
      ? totalInterest * (scenario.taxBracket / 100)
      : 0;
    
    const afterTaxInterest = totalInterest - taxSavings;
    const afterTaxRate = effectiveInterestRate;
    
    // Real cost analysis with tax considerations
    const realCostAdjustment = afterTaxRate - currentInflation;
    const inflationBenefit = realCostAdjustment < 0;
    
    // Compound growth of debt erosion by inflation
    const inflationErosion = scenario.loanAmount * 
      (Math.pow(1 + currentInflation / 100, scenario.termYears) - 1);
    
    return {
      monthlyPayment: monthlyPayment / (periodsPerYear / 12), // Convert to monthly
      totalInterest,
      afterTaxInterest,
      taxSavings,
      effectiveInterestRate: afterTaxRate,
      realCostAdjustment,
      inflationBenefit,
      inflationErosion,
      netRealCost: afterTaxInterest - inflationErosion,
      totalCost: scenario.loanAmount + totalInterest,
      afterTaxCost: scenario.loanAmount + afterTaxInterest
    };
  };

  const addScenario = () => {
    if (newScenario.name && newScenario.loanAmount > 0) {
      setScenarios([...scenarios, { ...newScenario, id: Date.now().toString() }]);
      setNewScenario({ 
        name: "", 
        loanAmount: 0, 
        interestRate: 0, 
        termYears: 0, 
        purpose: "Real Estate",
        taxDeductible: false,
        taxBracket: 22,
        compoundFrequency: 12
      });
    }
  };

  const removeScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  const comparisonData = scenarios.map(scenario => {
    const metrics = calculateScenarioMetrics(scenario);
    return {
      name: scenario.name,
      realCost: metrics.realCostAdjustment,
      monthlyPayment: metrics.monthlyPayment,
      beneficial: metrics.inflationBenefit
    };
  });

  return (
    <Card className="backdrop-blur-md bg-card-gradient border-glass-border shadow-glass animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Borrowing Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scenarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scenarios">Manage Scenarios</TabsTrigger>
            <TabsTrigger value="comparison">Compare Results</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="space-y-6">
            {/* Add New Scenario */}
            <Card className="bg-muted/30 border-muted">
              <CardHeader>
                <CardTitle className="text-lg">Add New Scenario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scenario-name">Scenario Name</Label>
                    <Input
                      id="scenario-name"
                      value={newScenario.name}
                      onChange={(e) => setNewScenario({...newScenario, name: e.target.value})}
                      placeholder="e.g., Car Purchase"
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select value={newScenario.purpose} onValueChange={(value) => setNewScenario({...newScenario, purpose: value})}>
                      <SelectTrigger className="transition-all duration-200 focus:scale-105">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Auto">Auto Loan</SelectItem>
                        <SelectItem value="Business">Business Loan</SelectItem>
                        <SelectItem value="Personal">Personal Loan</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loan-amount">Loan Amount ($)</Label>
                    <Input
                      id="loan-amount"
                      type="number"
                      value={newScenario.loanAmount || ""}
                      onChange={(e) => setNewScenario({...newScenario, loanAmount: parseFloat(e.target.value) || 0})}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <Input
                      id="interest-rate"
                      type="number"
                      step="0.1"
                      value={newScenario.interestRate || ""}
                      onChange={(e) => setNewScenario({...newScenario, interestRate: parseFloat(e.target.value) || 0})}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="term-years">Term (Years)</Label>
                    <Input
                      id="term-years"
                      type="number"
                      value={newScenario.termYears || ""}
                      onChange={(e) => setNewScenario({...newScenario, termYears: parseInt(e.target.value) || 0})}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                </div>

                {/* Tax and Advanced Options */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax-bracket">Tax Bracket (%)</Label>
                    <Select value={newScenario.taxBracket.toString()} onValueChange={(value) => setNewScenario({...newScenario, taxBracket: parseInt(value)})}>
                      <SelectTrigger className="transition-all duration-200 focus:scale-105">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10% - Low Income</SelectItem>
                        <SelectItem value="12">12% - Lower Middle</SelectItem>
                        <SelectItem value="22">22% - Middle Class</SelectItem>
                        <SelectItem value="24">24% - Upper Middle</SelectItem>
                        <SelectItem value="32">32% - High Income</SelectItem>
                        <SelectItem value="35">35% - Very High</SelectItem>
                        <SelectItem value="37">37% - Top Bracket</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="compound-freq">Compounding</Label>
                    <Select value={newScenario.compoundFrequency.toString()} onValueChange={(value) => setNewScenario({...newScenario, compoundFrequency: parseInt(value)})}>
                      <SelectTrigger className="transition-all duration-200 focus:scale-105">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">Monthly</SelectItem>
                        <SelectItem value="4">Quarterly</SelectItem>
                        <SelectItem value="2">Semi-Annual</SelectItem>
                        <SelectItem value="1">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 flex items-end">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="tax-deductible"
                        checked={newScenario.taxDeductible}
                        onChange={(e) => setNewScenario({...newScenario, taxDeductible: e.target.checked})}
                        className="rounded border-border"
                      />
                      <Label htmlFor="tax-deductible" className="text-sm">
                        Tax Deductible Interest
                      </Label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={addScenario} 
                  className="w-full hover:scale-105 transition-transform duration-200"
                  disabled={!newScenario.name || newScenario.loanAmount <= 0}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Scenario
                </Button>
              </CardContent>
            </Card>

            {/* Current Scenarios */}
            <div className="space-y-4">
              {scenarios.map((scenario, index) => {
                const metrics = calculateScenarioMetrics(scenario);
                return (
                  <Card 
                    key={scenario.id} 
                    className={`transition-all duration-300 hover:scale-105 animate-fade-in ${
                      metrics.inflationBenefit ? 'border-beneficial bg-beneficial-subtle' : 'border-risk bg-risk-subtle'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{scenario.name}</h3>
                            <span className="text-sm bg-primary/10 px-2 py-1 rounded-full">
                              {scenario.purpose}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Loan Amount</p>
                              <p className="font-semibold">${scenario.loanAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Monthly Payment</p>
                              <p className="font-semibold">${metrics.monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Effective Rate</p>
                              <p className="font-semibold text-accent-foreground">
                                {metrics.effectiveInterestRate.toFixed(2)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Tax Savings</p>
                              <p className="font-semibold text-beneficial">
                                ${metrics.taxSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Real Cost Impact</p>
                              <p className={`font-semibold ${metrics.inflationBenefit ? 'text-beneficial' : 'text-risk'}`}>
                                {metrics.realCostAdjustment > 0 ? '+' : ''}{metrics.realCostAdjustment.toFixed(2)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Net Benefit</p>
                              <p className={`font-semibold ${metrics.netRealCost < 0 ? 'text-beneficial' : 'text-risk'}`}>
                                ${Math.abs(metrics.netRealCost).toLocaleString(undefined, {maximumFractionDigits: 0})}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeScenario(scenario.id)}
                          className="hover:scale-110 transition-transform duration-200 text-risk hover:bg-risk/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    label={{ value: 'Real Cost Impact (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{label}</p>
                            <p className="text-sm text-muted-foreground">
                              Monthly: ${data.monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}
                            </p>
                            <p className={`text-sm font-medium ${data.beneficial ? 'text-beneficial' : 'text-risk'}`}>
                              Real Cost: {data.realCost > 0 ? '+' : ''}{data.realCost.toFixed(2)}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="realCost" 
                    radius={[4, 4, 0, 0]}
                    className="transition-all duration-300"
                  >
                    {comparisonData.map((entry, index) => (
                      <Cell 
                        key={`scenario-cell-${entry.name}-${index}`} 
                        fill={entry.beneficial ? "hsl(var(--beneficial))" : "hsl(var(--risk))"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ScenarioComparison;