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
  const [showHistory, setShowHistory] = useState(false);
  const [showProfessional, setShowProfessional] = useState(false);
  
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with Dual Appeal */}
        <div className="text-center space-y-6 py-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-light text-foreground tracking-tight">
              Should I Borrow Money?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Smart borrowing decisions made simple
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-beneficial"></div>
              <span>Real-time analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Historical data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-foreground"></div>
              <span>Professional tools</span>
            </div>
          </div>
        </div>

        {/* Main Answer Card - Prominent but Balanced */}
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Inflation:</span>
              <span className="font-bold text-beneficial">{customInflation[0].toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Your Rate:</span>
              <span className="font-bold text-primary">{customInterest[0].toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Difference:</span>
              <span className={`font-bold ${differenceValue < 0 ? 'text-beneficial' : 'text-risk'}`}>
                {differenceValue > 0 ? '+' : ''}{differenceValue.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        {/* Interactive Controls - Enhanced but Clean */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Try Different Scenarios</h3>
              <p className="text-sm text-muted-foreground">Adjust the rates to see when borrowing makes sense</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-beneficial" />
                    Inflation Rate
                  </label>
                  <span className="font-semibold text-beneficial bg-beneficial/10 px-3 py-1 rounded-full">
                    {customInflation[0].toFixed(1)}%
                  </span>
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
                  <span>No inflation</span>
                  <span>High inflation</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Loan Interest Rate
                  </label>
                  <span className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {customInterest[0].toFixed(1)}%
                  </span>
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
                  <span>Free money</span>
                  <span>Expensive loans</span>
                </div>
              </div>
            </div>
            
            {/* Real-time feedback */}
            <div className="text-center p-4 bg-gradient-to-r from-primary/5 to-beneficial/5 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">Real-time impact:</div>
              <div className="text-lg font-medium">
                {Math.abs(differenceValue) < 0.5 ? (
                  "Minimal difference - decision depends on other factors"
                ) : differenceValue < 0 ? (
                  `Inflation helps you save ${Math.abs(differenceValue).toFixed(1)}% per year`
                ) : (
                  `Borrowing costs you an extra ${differenceValue.toFixed(1)}% per year`
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Tiered Information Architecture */}
        <div className="space-y-6">
          {/* Level 1: Basic Understanding */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-2"
            >
              <Info className="h-4 w-4" />
              {showAdvanced ? 'Hide Details' : 'Learn How This Works'}
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleContent className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Understanding the Basics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 p-4 bg-beneficial/5 rounded-lg border border-beneficial/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-beneficial" />
                      <h4 className="font-semibold text-beneficial">Good Time to Borrow</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      When inflation is higher than your loan rate, inflation essentially helps pay off your debt. 
                      Each dollar you owe becomes worth less over time.
                    </p>
                    <div className="text-xs text-beneficial font-medium">
                      Example: 6% inflation, 4% loan rate = 2% benefit per year
                    </div>
                  </div>
                  
                  <div className="space-y-3 p-4 bg-risk/5 rounded-lg border border-risk/20">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-risk" />
                      <h4 className="font-semibold text-risk">Wait for Better Rates</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      When loan rates exceed inflation, you're paying a real cost. 
                      Your payments hurt more than inflation helps.
                    </p>
                    <div className="text-xs text-risk font-medium">
                      Example: 3% inflation, 7% loan rate = 4% real cost per year
                    </div>
                  </div>
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Level 2: Historical Context */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowHistory(!showHistory)}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {showHistory ? 'Hide History' : 'See Historical Trends'}
              <ChevronDown className={`h-4 w-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <Collapsible open={showHistory} onOpenChange={setShowHistory}>
            <CollapsibleContent className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">50+ Years of Market Data</h3>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold text-beneficial">1970s-1980s</div>
                      <div className="text-muted-foreground">High inflation era</div>
                      <div className="text-xs">Great time to borrow</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold text-primary">1990s-2000s</div>
                      <div className="text-muted-foreground">Stable period</div>
                      <div className="text-xs">Mixed conditions</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold text-risk">2020s</div>
                      <div className="text-muted-foreground">Rising rates</div>
                      <div className="text-xs">Careful evaluation needed</div>
                    </div>
                  </div>
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Level 3: Professional Tools */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowProfessional(!showProfessional)}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {showProfessional ? 'Hide Professional Tools' : 'Advanced Analysis & Simulations'}
              <ChevronDown className={`h-4 w-4 transition-transform ${showProfessional ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <Collapsible open={showProfessional} onOpenChange={setShowProfessional}>
            <CollapsibleContent className="space-y-6">
              <div className="bg-gradient-to-r from-primary/5 to-beneficial/5 p-4 rounded-lg border border-primary/20">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Professional Financial Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced tools for financial advisors, investors, and detailed personal analysis
                  </p>
                </div>
              </div>

              <Tabs defaultValue="scenarios" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                  <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="simulation">Simulation</TabsTrigger>
                  <TabsTrigger value="tools">Export</TabsTrigger>
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
                
                <TabsContent value="simulation" className="mt-6">
                  <div className="space-y-6">
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
                    <AdvancedMarketIndicators />
                  </div>
                </TabsContent>
                
                <TabsContent value="tools" className="mt-6">
                  <ExportTools data={historicalData} scenarios={[]} />
                </TabsContent>
              </Tabs>
            </CollapsibleContent>
          </Collapsible>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;