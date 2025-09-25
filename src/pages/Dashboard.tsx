import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
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
      <div className="max-w-7xl mx-auto space-y-8 stagger-children">
        {/* Enhanced Header */}
        <div className="text-center space-y-6 py-8">
          <div className="floating-element">
            <h1 className="text-5xl md:text-6xl font-light text-foreground tracking-tight mb-4">
              <span className="bg-gradient-to-br from-primary via-primary-glow to-beneficial bg-clip-text text-transparent">
                Cash Currents
              </span>
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Navigate the flow of money through time • Discover when inflation transforms borrowing into profit
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-beneficial animate-pulse"></div>
            <span>Real-time financial intelligence</span>
          </div>
        </div>

        {/* Enhanced Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="metric-card group animated-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Outlook</CardTitle>
              <div className={`p-2 rounded-lg transition-colors ${currentData.beneficial ? 'bg-beneficial/20' : 'bg-risk/20'}`}>
                {currentData.beneficial ? (
                  <TrendingUp className="h-5 w-5 text-beneficial" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-risk" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`metric-value ${currentData.beneficial ? 'from-beneficial to-beneficial' : 'from-risk to-risk'}`}>
                {currentData.beneficial ? "Beneficial" : "Not Beneficial"}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {currentData.beneficial 
                  ? "Inflation eroding debt faster than interest accumulates"
                  : "Interest costs exceed inflation benefits"
                }
              </p>
              <div className="mt-4 h-2 bg-muted/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${currentData.beneficial ? 'bg-beneficial' : 'bg-risk'}`}
                  style={{ width: `${Math.min(100, Math.abs(differenceValue) * 10)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Impact</CardTitle>
              <div className="p-2 rounded-lg bg-primary/20 transition-colors group-hover:bg-primary/30">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="metric-value">
                {differenceValue > 0 ? "+" : ""}{differenceValue.toFixed(2)}%
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Interest rate vs inflation difference
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-muted/50 rounded-full">
                  {Math.abs(differenceValue) < 1 ? 'Minimal' : Math.abs(differenceValue) < 3 ? 'Moderate' : 'Significant'} Impact
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Impact Level</CardTitle>
              <div className="p-2 rounded-lg bg-accent/20 transition-colors group-hover:bg-accent/30">
                <BarChart3 className="h-5 w-5 text-accent-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="metric-value from-accent-foreground to-primary">
                {impactLevel < 1 ? "Low" : impactLevel < 3 ? "Moderate" : "High"}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {impactLevel.toFixed(1)}% magnitude difference
              </p>
              <div className="mt-4 grid grid-cols-3 gap-1">
                {[1, 2, 3].map((level) => (
                  <div 
                    key={level}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      impactLevel >= level ? 'bg-accent-foreground' : 'bg-muted/30'
                    }`}
                    style={{ animationDelay: `${level * 0.1}s` }}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Interactive Controls */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl font-light">Interactive Analysis</span>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6 p-6 rounded-xl bg-gradient-to-br from-muted/30 to-transparent border border-muted/40">
                <div className="space-y-4">
                  <label className="text-base font-medium mb-4 block flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-beneficial" />
                    Inflation Rate: 
                    <span className="font-mono text-lg text-beneficial">{customInflation[0].toFixed(1)}%</span>
                  </label>
                  <Slider
                    value={customInflation}
                    onValueChange={setCustomInflation}
                    min={0}
                    max={15}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Deflation (0%)</span>
                    <span>Hyperinflation (15%)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 p-6 rounded-xl bg-gradient-to-br from-muted/30 to-transparent border border-muted/40">
                <div className="space-y-4">
                  <label className="text-base font-medium mb-4 block flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Interest Rate: 
                    <span className="font-mono text-lg text-primary">{customInterest[0].toFixed(1)}%</span>
                  </label>
                  <Slider
                    value={customInterest}
                    onValueChange={setCustomInterest}
                    min={0}
                    max={20}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Zero rates (0%)</span>
                    <span>High rates (20%)</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Real-time calculation display */}
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-beneficial/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Real-time Calculation:</span>
                <span className="font-mono text-lg">
                  {customInflation[0].toFixed(1)}% - {customInterest[0].toFixed(1)}% = 
                  <span className={`ml-2 font-bold ${differenceValue < 0 ? 'text-beneficial' : 'text-risk'}`}>
                    {differenceValue > 0 ? '+' : ''}{differenceValue.toFixed(2)}%
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Historical Chart */}
        <Card className="glass-card chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl font-light">Historical Market Intelligence</span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-chart-primary"></div>
                <span>Interest Rates</span>
                <div className="w-2 h-2 rounded-full bg-chart-secondary"></div>
                <span>Inflation</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                  <XAxis 
                    dataKey="year" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--border))" />
                  <Line
                    type="monotone"
                    dataKey="inflation"
                    stroke="hsl(var(--chart-secondary))"
                    strokeWidth={2}
                    dot={false}
                    name="Inflation Rate"
                  />
                  <Line
                    type="monotone"
                    dataKey="interestRate"
                    stroke="hsl(var(--chart-primary))"
                    strokeWidth={2}
                    dot={false}
                    name="Interest Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Timeline Scrubber */}
            <div className="mt-6">
              <label className="text-sm font-medium mb-2 block">
                Historical Year: {selectedYear}
              </label>
              <Slider
                value={[selectedYear]}
                onValueChange={(value) => setSelectedYear(value[0])}
                min={1970}
                max={2024}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Scenario Comparison */}
        <ScenarioComparison currentInflation={currentData.inflation} />

        {/* Portfolio Integration */}
        <PortfolioIntegration 
          currentInflation={currentData.inflation}
          loanImpact={undefined}
        />

        {/* Asset Price Overlay */}
        <AssetOverlay selectedYear={selectedYear} onYearChange={setSelectedYear} />

        {/* Export Tools */}
        <ExportTools data={historicalData} scenarios={[]} />

        {/* Advanced Analytics Section */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-light text-foreground tracking-tight">
              Advanced Analytics & Predictive Models
            </h2>
            <p className="text-muted-foreground">
              Comprehensive market analysis, simulations, and strategic insights
            </p>
          </div>

          {/* Market Indicators */}
          <AdvancedMarketIndicators />
          
          {/* Monte Carlo & Sector Analysis */}
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
          
          {/* Currency Exchange */}
          <CurrencyExchange 
            baseInflation={customInflation[0]}
            baseInterest={customInterest[0]}
          />
        </div>

        {/* Explanation */}
        <Card className="backdrop-blur-md bg-card-gradient border-glass-border shadow-glass">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-beneficial">When Borrowing is Beneficial</h3>
                <p className="text-sm text-muted-foreground">
                  When inflation exceeds your borrowing rate, the real cost of your debt decreases over time. 
                  You're essentially being paid to borrow as inflation erodes the purchasing power of your debt.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-risk">When Borrowing Costs You</h3>
                <p className="text-sm text-muted-foreground">
                  When interest rates exceed inflation, you pay a real cost for borrowing. 
                  The purchasing power of your payments exceeds the erosion from inflation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;