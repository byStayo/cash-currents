import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, BarChart3, ChevronDown, Info } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ScenarioComparison from "@/components/ScenarioComparison";
import AssetOverlay from "@/components/AssetOverlay";
import ExportTools from "@/components/ExportTools";
import PortfolioIntegration from "@/components/PortfolioIntegration";
import AdvancedMarketIndicators from "@/components/AdvancedMarketIndicators";
import MonteCarloSimulation from "@/components/MonteCarloSimulation";
import SectorAnalysis from "@/components/SectorAnalysis";
import CurrencyExchange from "@/components/CurrencyExchange";
import { AnswerCard } from "@/components/shared/AnswerCard";
import { InteractiveControls } from "@/components/shared/InteractiveControls";

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
        <header className="text-center space-y-6 py-8">
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
              <div className="w-2 h-2 rounded-full bg-beneficial" aria-hidden="true"></div>
              <span>Real-time analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true"></div>
              <span>Historical data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-foreground" aria-hidden="true"></div>
              <span>Professional tools</span>
            </div>
          </div>
        </header>

        {/* Main Answer Card */}
        <main>
          <AnswerCard 
            beneficial={currentData.beneficial}
            inflationRate={customInflation[0]}
            interestRate={customInterest[0]}
            difference={differenceValue}
          />

          {/* Interactive Controls */}
          <div className="mt-8">
            <InteractiveControls
              customInflation={customInflation}
              setCustomInflation={setCustomInflation}
              customInterest={customInterest}
              setCustomInterest={setCustomInterest}
              differenceValue={differenceValue}
            />
          </div>
        </main>

        {/* Tiered Information Architecture */}
        <aside className="space-y-6">
          {/* Level 1: Basic Understanding */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-2"
              aria-expanded={showAdvanced}
              aria-controls="advanced-content"
            >
              <Info className="h-4 w-4" aria-hidden="true" />
              {showAdvanced ? 'Hide Details' : 'Learn How This Works'}
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Button>
          </div>

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleContent className="space-y-6" id="advanced-content">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Understanding the Basics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 p-4 bg-beneficial/5 rounded-lg border border-beneficial/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-beneficial" aria-hidden="true" />
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
                      <TrendingDown className="h-5 w-5 text-risk" aria-hidden="true" />
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
              aria-expanded={showHistory}
              aria-controls="history-content"
            >
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              {showHistory ? 'Hide History' : 'See Historical Trends'}
              <ChevronDown className={`h-4 w-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Button>
          </div>

          <Collapsible open={showHistory} onOpenChange={setShowHistory}>
            <CollapsibleContent className="space-y-6" id="history-content">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">50+ Years of Market Data</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" aria-hidden="true"></div>
                        <span>Interest Rates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-beneficial" aria-hidden="true"></div>
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
              aria-expanded={showProfessional}
              aria-controls="professional-content"
            >
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              {showProfessional ? 'Hide Professional Tools' : 'Advanced Analysis & Simulations'}
              <ChevronDown className={`h-4 w-4 transition-transform ${showProfessional ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Button>
          </div>

          <Collapsible open={showProfessional} onOpenChange={setShowProfessional}>
            <CollapsibleContent className="space-y-6" id="professional-content">
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
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;