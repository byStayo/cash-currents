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
import { LoanCalculator } from "@/components/LoanCalculator";
import { CreditScoreImpact } from "@/components/CreditScoreImpact";
import { TaxImplications } from "@/components/TaxImplications";
import { DebtConsolidation } from "@/components/DebtConsolidation";
import { InvestmentComparison } from "@/components/InvestmentComparison";
import { RiskAssessment } from "@/components/RiskAssessment";
import { RatePredictor } from "@/components/RatePredictor";
import { AnswerCard } from "@/components/shared/AnswerCard";
import { InteractiveControls } from "@/components/shared/InteractiveControls";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { SkeletonLoader } from "@/components/shared/SkeletonLoader";

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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-8 md:pb-12">
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Header with Dual Appeal */}
        <header className="text-center space-y-4 md:space-y-6 py-6 md:py-8 px-4">
          <div className="space-y-3 md:space-y-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light text-foreground tracking-tight leading-tight">
              Should I Borrow Money?
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Smart borrowing decisions made simple
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground px-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-beneficial animate-pulse" aria-hidden="true"></div>
              <span className="font-medium">Real-time analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true"></div>
              <span className="font-medium">Historical data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-foreground" aria-hidden="true"></div>
              <span className="font-medium">Professional tools</span>
            </div>
          </div>
        </header>

        {/* Main Answer Card */}
        <main id="main-content">
          <AnswerCard 
            beneficial={currentData.beneficial}
            inflationRate={customInflation[0]}
            interestRate={customInterest[0]}
            difference={differenceValue}
          />

          {/* Interactive Controls */}
          <div className="mt-6 md:mt-8 px-4 md:px-0">
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
        <aside className="space-y-4 md:space-y-6 px-4 md:px-0">
          {/* Level 1: Basic Understanding */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-2 button-hover focus-ring h-12 md:h-11 px-6 md:px-4 text-sm md:text-base font-medium"
              aria-expanded={showAdvanced}
              aria-controls="advanced-content"
            >
              <Info className="h-4 w-4" aria-hidden="true" />
              {showAdvanced ? 'Hide Details' : 'Learn How This Works'}
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Button>
          </div>

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleContent className="space-y-4 md:space-y-6 animate-fade-in-up" id="advanced-content">
              <Card className="glass-card card-hover state-transition">
                <div className="p-4 md:p-6">
                  <h3 className="text-lg font-semibold mb-4 text-center font-display">Understanding the Basics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-3 p-4 bg-beneficial/5 rounded-2xl border border-beneficial/20 interactive-element">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-beneficial" aria-hidden="true" />
                        <h4 className="font-semibold text-beneficial">Good Time to Borrow</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        When inflation is higher than your loan rate, inflation essentially helps pay off your debt. 
                        Each dollar you owe becomes worth less over time.
                      </p>
                      <div className="text-xs text-beneficial font-medium bg-beneficial/10 px-3 py-2 rounded-lg">
                        Example: 6% inflation, 4% loan rate = 2% benefit per year
                      </div>
                    </div>
                    
                    <div className="space-y-3 p-4 bg-risk/5 rounded-2xl border border-risk/20 interactive-element">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-risk" aria-hidden="true" />
                        <h4 className="font-semibold text-risk">Wait for Better Rates</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        When loan rates exceed inflation, you're paying a real cost. 
                        Your payments hurt more than inflation helps.
                      </p>
                      <div className="text-xs text-risk font-medium bg-risk/10 px-3 py-2 rounded-lg">
                        Example: 3% inflation, 7% loan rate = 4% real cost per year
                      </div>
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
              className="gap-2 button-hover focus-ring h-12 md:h-11 px-6 md:px-4 text-sm md:text-base font-medium"
              aria-expanded={showHistory}
              aria-controls="history-content"
            >
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              {showHistory ? 'Hide History' : 'See Historical Trends'}
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showHistory ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Button>
          </div>

          <Collapsible open={showHistory} onOpenChange={setShowHistory}>
            <CollapsibleContent className="space-y-6" id="history-content">
              <Card className="p-6 card-hover state-transition">
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
              className="gap-2 button-hover focus-ring h-12 md:h-11 px-6 md:px-4 text-sm md:text-base font-medium"
              aria-expanded={showProfessional}
              aria-controls="professional-content"
            >
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              {showProfessional ? 'Hide Professional Tools' : 'Advanced Analysis & Simulations'}
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showProfessional ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Button>
          </div>

          <Collapsible open={showProfessional} onOpenChange={setShowProfessional}>
            <CollapsibleContent className="space-y-4 md:space-y-6 animate-fade-in-up" id="professional-content">
              <div className="bg-gradient-to-r from-primary/5 to-beneficial/5 p-4 md:p-6 rounded-2xl border border-primary/10">
                <div className="text-center space-y-2">
                  <h3 className="text-lg md:text-xl font-semibold font-display">Professional Financial Analysis</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Advanced tools for financial advisors, investors, and detailed personal analysis
                  </p>
                </div>
              </div>

              <Tabs defaultValue="scenarios" className="w-full">
                <div className="overflow-x-auto scrollbar-hide pb-2">
                  <TabsList className="grid w-max grid-cols-15 gap-1 mx-auto min-w-full">
                    <TabsTrigger value="scenarios" className="text-xs whitespace-nowrap px-3">Scenarios</TabsTrigger>
                    <TabsTrigger value="assets" className="text-xs whitespace-nowrap px-3">Assets</TabsTrigger>
                    <TabsTrigger value="portfolio" className="text-xs whitespace-nowrap px-3">Portfolio</TabsTrigger>
                    <TabsTrigger value="monte-carlo" className="text-xs whitespace-nowrap px-3">Monte Carlo</TabsTrigger>
                    <TabsTrigger value="sectors" className="text-xs whitespace-nowrap px-3">Sectors</TabsTrigger>
                    <TabsTrigger value="currency" className="text-xs whitespace-nowrap px-3">Currency</TabsTrigger>
                    <TabsTrigger value="indicators" className="text-xs whitespace-nowrap px-3">Indicators</TabsTrigger>
                    <TabsTrigger value="loan-calc" className="text-xs whitespace-nowrap px-3">Loan Calc</TabsTrigger>
                    <TabsTrigger value="credit" className="text-xs whitespace-nowrap px-3">Credit</TabsTrigger>
                    <TabsTrigger value="tax" className="text-xs whitespace-nowrap px-3">Tax</TabsTrigger>
                    <TabsTrigger value="debt" className="text-xs whitespace-nowrap px-3">Debt</TabsTrigger>
                    <TabsTrigger value="invest" className="text-xs whitespace-nowrap px-3">Invest</TabsTrigger>
                    <TabsTrigger value="risk" className="text-xs whitespace-nowrap px-3">Risk</TabsTrigger>
                    <TabsTrigger value="predictor" className="text-xs whitespace-nowrap px-3">Predictor</TabsTrigger>
                    <TabsTrigger value="tools" className="text-xs whitespace-nowrap px-3">Export</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="scenarios" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="card" />}>
                    <ScenarioComparison currentInflation={currentData.inflation} />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="assets" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="chart" />}>
                    <AssetOverlay selectedYear={selectedYear} onYearChange={setSelectedYear} />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="portfolio" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="metrics" />}>
                    <PortfolioIntegration 
                      currentInflation={currentData.inflation}
                      loanImpact={undefined}
                    />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="monte-carlo" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="chart" />}>
                    <MonteCarloSimulation 
                      currentInflation={customInflation[0]}
                      customInterest={customInterest[0]}
                    />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="sectors" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="chart" />}>
                    <SectorAnalysis 
                      currentInflation={customInflation[0]}
                      currentInterest={customInterest[0]}
                    />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="currency" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="chart" />}>
                    <CurrencyExchange 
                      baseInflation={customInflation[0]}
                      baseInterest={customInterest[0]}
                    />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="indicators" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="chart" />}>
                    <AdvancedMarketIndicators />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="loan-calc" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="card" />}>
                    <LoanCalculator />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="credit" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="metrics" />}>
                    <CreditScoreImpact 
                      currentInflation={customInflation[0]}
                      currentInterest={customInterest[0]}
                    />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="tax" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="chart" />}>
                    <TaxImplications 
                      currentInflation={customInflation[0]}
                      currentInterest={customInterest[0]}
                    />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="debt" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="card" />}>
                    <DebtConsolidation />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="invest" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="chart" />}>
                    <InvestmentComparison 
                      currentInflation={customInflation[0]}
                      currentInterest={customInterest[0]}
                    />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="risk" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="metrics" />}>
                    <RiskAssessment />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="predictor" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="chart" />}>
                    <RatePredictor 
                      currentInflation={customInflation[0]}
                      currentInterest={customInterest[0]}
                    />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="tools" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="list" />}>
                    <ExportTools data={historicalData} scenarios={[]} />
                  </ErrorBoundary>
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