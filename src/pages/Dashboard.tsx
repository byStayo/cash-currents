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
import { LoanApprovalTool } from "@/components/LoanApprovalTool";
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
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8">
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Clean Header */}
        <header className="text-center space-y-6 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Should I Borrow Money?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Smart borrowing decisions made simple
            </p>
          </div>
          
          {/* Feature indicators */}
          <div className="flex items-center justify-center gap-4 md:gap-6 text-sm">
            <div className="flex items-center gap-2 smooth-transition hover:scale-105">
              <div className="w-2 h-2 rounded-full bg-beneficial animate-pulse"></div>
              <span className="font-medium text-muted-foreground">Real-time</span>
            </div>
            <div className="flex items-center gap-2 smooth-transition hover:scale-105">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="font-medium text-muted-foreground">Historical</span>
            </div>
            <div className="flex items-center gap-2 smooth-transition hover:scale-105">
              <div className="w-2 h-2 rounded-full bg-accent-foreground"></div>
              <span className="font-medium text-muted-foreground">Professional</span>
            </div>
          </div>
        </header>

        {/* Main Answer Card */}
        <main id="main-content" className="space-y-6">
          <div className="animate-scale-in">
            <AnswerCard 
              beneficial={currentData.beneficial}
              inflationRate={customInflation[0]}
              interestRate={customInterest[0]}
              difference={differenceValue}
            />
          </div>

          {/* Interactive Controls */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <InteractiveControls
              customInflation={customInflation}
              setCustomInflation={setCustomInflation}
              customInterest={customInterest}
              setCustomInterest={setCustomInterest}
              differenceValue={differenceValue}
            />
          </div>
        </main>

        {/* Information Architecture */}
        <aside className="space-y-6">
          {/* Level 1: Understanding */}
          <div className="text-center">
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="outline"
              className="gap-2 h-12 px-6 smooth-transition hover-scale focus-ring touch-feedback"
              aria-expanded={showAdvanced}
              aria-controls="advanced-content"
            >
              <Info className="h-4 w-4" />
              {showAdvanced ? 'Hide Details' : 'Learn How This Works'}
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleContent className="space-y-4 md:space-y-6 animate-fade-in" id="advanced-content" style={{ animationDelay: '0.1s' }}>
              <Card className="glass-card card-hover smooth-transition">
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

          {/* Level 2: Historical Data */}
          <div className="text-center">
            <Button
              onClick={() => setShowHistory(!showHistory)}
              variant="outline"
              className="gap-2 h-12 px-6 smooth-transition hover-scale focus-ring touch-feedback"
              aria-expanded={showHistory}
              aria-controls="history-content"
            >
              <BarChart3 className="h-4 w-4" />
              {showHistory ? 'Hide History' : 'Historical Trends'}
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <Collapsible open={showHistory} onOpenChange={setShowHistory}>
            <CollapsibleContent className="space-y-6 animate-fade-in" id="history-content" style={{ animationDelay: '0.2s' }}>
              <Card className="p-6 card-hover smooth-transition">
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
                          className="chart-text-sm"
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          className="chart-text-sm"
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

          {/* Level 3: Professional Analysis */}
          <div className="text-center">
            <Button
              onClick={() => setShowProfessional(!showProfessional)}
              className="gap-2 h-12 px-6 smooth-transition hover-scale focus-ring touch-feedback premium-hover"
              aria-expanded={showProfessional}
              aria-controls="professional-content"
            >
              <BarChart3 className="h-4 w-4" />
              {showProfessional ? 'Hide Tools' : 'Professional Analysis'}
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showProfessional ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <Collapsible open={showProfessional} onOpenChange={setShowProfessional}>
            <CollapsibleContent className="space-y-4 md:space-y-6 animate-fade-in" id="professional-content" style={{ animationDelay: '0.3s' }}>
              <div className="bg-gradient-to-r from-primary/5 to-beneficial/5 p-4 md:p-6 rounded-2xl border border-primary/10 glass-morphism">
                <div className="text-center space-y-2">
                  <h3 className="text-lg md:text-xl font-semibold font-display">Professional Financial Analysis</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Advanced tools for financial advisors, investors, and detailed personal analysis
                  </p>
                </div>
              </div>

              <Tabs defaultValue="scenarios" className="w-full">
                <div className="overflow-x-auto pb-2">
                  <TabsList className="flex w-max gap-1 mx-auto focus-ring min-w-full md:min-w-max">
                    <TabsTrigger value="scenarios" className="focus-ring flex-shrink-0">Scenarios</TabsTrigger>
                    <TabsTrigger value="assets" className="focus-ring flex-shrink-0">Assets</TabsTrigger>
                    <TabsTrigger value="portfolio" className="focus-ring flex-shrink-0">Portfolio</TabsTrigger>
                    <TabsTrigger value="monte-carlo" className="focus-ring flex-shrink-0">Monte Carlo</TabsTrigger>
                    <TabsTrigger value="sectors" className="focus-ring flex-shrink-0">Sectors</TabsTrigger>
                    <TabsTrigger value="currency" className="focus-ring flex-shrink-0">Currency</TabsTrigger>
                    <TabsTrigger value="indicators" className="focus-ring flex-shrink-0">Indicators</TabsTrigger>
                    <TabsTrigger value="loan-calc" className="focus-ring flex-shrink-0">Loan Calc</TabsTrigger>
                    <TabsTrigger value="approval" className="focus-ring flex-shrink-0">Approval</TabsTrigger>
                    <TabsTrigger value="credit" className="focus-ring flex-shrink-0">Credit</TabsTrigger>
                    <TabsTrigger value="risk" className="focus-ring flex-shrink-0">Risk</TabsTrigger>
                    <TabsTrigger value="tax" className="focus-ring flex-shrink-0">Tax</TabsTrigger>
                    <TabsTrigger value="debt" className="focus-ring flex-shrink-0">Debt</TabsTrigger>
                    <TabsTrigger value="invest" className="focus-ring flex-shrink-0">Investment</TabsTrigger>
                    <TabsTrigger value="predictor" className="focus-ring flex-shrink-0">Rate Predictor</TabsTrigger>
                    <TabsTrigger value="export" className="focus-ring flex-shrink-0">Export</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="scenarios" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="professional" />}>
                    <ScenarioComparison currentInflation={currentData.inflation} />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="assets" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="chart" />}>
                    <AssetOverlay selectedYear={selectedYear} onYearChange={setSelectedYear} />
                  </ErrorBoundary>
                </TabsContent>
                
                <TabsContent value="portfolio" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="professional" />}>
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
                  <ErrorBoundary fallback={<SkeletonLoader type="professional" />}>
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
                
                <TabsContent value="approval" className="mt-6">
                  <ErrorBoundary fallback={<SkeletonLoader type="metrics" />}>
                    <LoanApprovalTool />
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