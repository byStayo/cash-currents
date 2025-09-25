import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, ChevronDown, Info } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ScenarioComparison from "@/components/ScenarioComparison";
import AssetOverlay from "@/components/AssetOverlay";
import ExportTools from "@/components/ExportTools";
import PortfolioIntegration from "@/components/PortfolioIntegration";
import AdvancedMarketIndicators from "@/components/AdvancedMarketIndicators";
import MonteCarloSimulation from "@/components/MonteCarloSimulation";
import SectorAnalysis from "@/components/SectorAnalysis";
import CurrencyExchange from "@/components/CurrencyExchange";

// Historical data simulation (inflation and interest rates)
const generateHistoricalData = () => {
  const data = [];
  const startYear = 1970;
  const endYear = 2024;
  
  for (let year = startYear; year <= endYear; year++) {
    // Simulate realistic historical patterns
    const baseInflation = 2 + Math.sin((year - 1970) * 0.15) * 3 + Math.random() * 2;
    const baseInterest = baseInflation + 1 + Math.sin((year - 1970) * 0.1) * 4 + Math.random() * 1.5;
    
    data.push({
      year,
      inflation: Math.max(0, baseInflation),
      interestRate: Math.max(0, baseInterest),
      beneficial: baseInflation > baseInterest,
    });
  }
  
  return data;
};

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [customInflation, setCustomInflation] = useState([3.2]);
  const [customInterest, setCustomInterest] = useState([5.8]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const historicalData = useMemo(() => generateHistoricalData(), []);
  
  const currentData = useMemo(() => {
    const yearData = historicalData.find(d => d.year === selectedYear);
    return {
      inflation: yearData?.inflation || customInflation[0],
      interestRate: yearData?.interestRate || customInterest[0],
      beneficial: (yearData?.inflation || customInflation[0]) > (yearData?.interestRate || customInterest[0]),
    };
  }, [selectedYear, customInflation, customInterest, historicalData]);

  const differenceValue = currentData.interestRate - currentData.inflation;
  const impactLevel = Math.abs(differenceValue);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Simplified Header */}
        <div className="text-center space-y-4 py-12">
          <h1 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
            Should I Borrow Money?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple way to understand when borrowing money makes financial sense
          </p>
        </div>

        {/* Main Answer Card */}
        <Card className="text-center p-8 border-2 transition-all duration-300 hover:shadow-lg">
          <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-full text-lg font-medium mb-4 ${
            currentData.beneficial 
              ? 'bg-beneficial/10 text-beneficial border border-beneficial/20' 
              : 'bg-risk/10 text-risk border border-risk/20'
          }`}>
            {currentData.beneficial ? (
              <TrendingUp className="h-6 w-6" />
            ) : (
              <TrendingDown className="h-6 w-6" />
            )}
            <span className="text-2xl font-semibold">
              {currentData.beneficial ? "Yes, it makes sense" : "No, wait for better rates"}
            </span>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {currentData.beneficial 
              ? "Current conditions favor borrowing. Inflation is reducing your debt burden faster than interest accumulates."
              : "Current interest rates are higher than inflation. Your money costs more than the inflation benefit."
            }
          </p>
          <div className="mt-6 text-sm text-muted-foreground">
            <span className="font-medium">Quick math:</span> {customInflation[0].toFixed(1)}% inflation - {customInterest[0].toFixed(1)}% interest = {differenceValue > 0 ? '+' : ''}{differenceValue.toFixed(1)}%
          </div>
        </Card>

        {/* Simple Controls */}
        <Card className="p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-center">Try Different Scenarios</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium">Inflation Rate</label>
                  <span className="font-semibold text-beneficial">{customInflation[0].toFixed(1)}%</span>
                </div>
                <Slider
                  value={customInflation}
                  onValueChange={setCustomInflation}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>10%</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium">Loan Interest Rate</label>
                  <span className="font-semibold text-primary">{customInterest[0].toFixed(1)}%</span>
                </div>
                <Slider
                  value={customInterest}
                  onValueChange={setCustomInterest}
                  min={0}
                  max={15}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>15%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Progressive Disclosure for More Info */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <div className="text-center">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Info className="h-4 w-4" />
                {showAdvanced ? 'Show Less' : 'Learn More & See History'}
                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="space-y-8 mt-8">
            {/* Simple explanation first */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">How This Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-beneficial">✓ When to Borrow</h4>
                  <p className="text-muted-foreground">
                    When inflation is higher than your loan rate, inflation helps pay off your debt. 
                    Your monthly payments become "cheaper" over time.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-risk">✗ When to Wait</h4>
                  <p className="text-muted-foreground">
                    When loan rates are higher than inflation, you're paying more than inflation helps. 
                    Better to wait for rates to drop or inflation to rise.
                  </p>
                </div>
              </div>
            </Card>

            {/* Historical Chart */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Historical Perspective</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span>Interest Rates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-beneficial"></div>
                      <span>Inflation</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="year" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Line
                        type="monotone"
                        dataKey="inflation"
                        stroke="hsl(var(--beneficial))"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="interestRate"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
            
            {/* Advanced Features in Tabs */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Advanced Analysis</h3>
              <Tabs defaultValue="scenarios" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="tools">Tools</TabsTrigger>
                </TabsList>
                
                <TabsContent value="scenarios" className="mt-6">
                  <ScenarioComparison currentInflation={currentData.inflation} />
                </TabsContent>
                
                <TabsContent value="assets" className="mt-6">
                  <AssetOverlay selectedYear={selectedYear} onYearChange={setSelectedYear} />
                </TabsContent>
                
                <TabsContent value="portfolio" className="mt-6">
                  <PortfolioIntegration 
                    currentInflation={currentData.inflation}
                    loanImpact={undefined}
                  />
                </TabsContent>
                
                <TabsContent value="tools" className="mt-6">
                  <div className="space-y-6">
                    <ExportTools data={historicalData} scenarios={[]} />
                    <div className="grid lg:grid-cols-2 gap-6">
                      <MonteCarloSimulation 
                        currentInflation={customInflation[0]}
                        customInterest={customInterest[0]}
                      />
                      <SectorAnalysis 
                        currentInflation={customInflation[0]}
                        currentInterest={customInterest[0]}
                      />
                    </div>
                    <CurrencyExchange 
                      baseInflation={customInflation[0]}
                      baseInterest={customInterest[0]}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </CollapsibleContent>
        </Collapsible>

      </div>
    </div>
  );
};

export default Dashboard;