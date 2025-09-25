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
      purpose: "Real Estate"
    }
  ]);

  const [newScenario, setNewScenario] = useState<Omit<Scenario, "id">>({
    name: "",
    loanAmount: 0,
    interestRate: 0,
    termYears: 0,
    purpose: "Real Estate"
  });

  const calculateScenarioMetrics = (scenario: Scenario) => {
    const monthlyRate = scenario.interestRate / 100 / 12;
    const numPayments = scenario.termYears * 12;
    const monthlyPayment = scenario.loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalInterest = (monthlyPayment * numPayments) - scenario.loanAmount;
    const realCostAdjustment = scenario.interestRate - currentInflation;
    const inflationBenefit = realCostAdjustment < 0;
    
    return {
      monthlyPayment,
      totalInterest,
      realCostAdjustment,
      inflationBenefit,
      totalCost: scenario.loanAmount + totalInterest
    };
  };

  const addScenario = () => {
    if (newScenario.name && newScenario.loanAmount > 0) {
      setScenarios([...scenarios, { ...newScenario, id: Date.now().toString() }]);
      setNewScenario({ name: "", loanAmount: 0, interestRate: 0, termYears: 0, purpose: "Real Estate" });
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
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Loan Amount</p>
                              <p className="font-semibold">${scenario.loanAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Monthly Payment</p>
                              <p className="font-semibold">${metrics.monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Real Cost Impact</p>
                              <p className={`font-semibold ${metrics.inflationBenefit ? 'text-beneficial' : 'text-risk'}`}>
                                {metrics.realCostAdjustment > 0 ? '+' : ''}{metrics.realCostAdjustment.toFixed(2)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Status</p>
                              <p className={`font-semibold ${metrics.inflationBenefit ? 'text-beneficial' : 'text-risk'}`}>
                                {metrics.inflationBenefit ? 'Beneficial' : 'Costly'}
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
                        key={`cell-${index}`} 
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