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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light text-foreground tracking-tight">
            Borrowing Intelligence
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visualize when inflation makes borrowing mathematically beneficial across time
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="backdrop-blur-md bg-card-gradient border-glass-border shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Outlook</CardTitle>
              {currentData.beneficial ? (
                <TrendingUp className="h-4 w-4 text-beneficial" />
              ) : (
                <TrendingDown className="h-4 w-4 text-risk" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentData.beneficial ? "Beneficial" : "Not Beneficial"}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentData.beneficial 
                  ? "Inflation is eroding debt faster than interest accumulates"
                  : "Interest costs exceed inflation benefits"
                }
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-card-gradient border-glass-border shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Impact</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {differenceValue > 0 ? "+" : ""}{differenceValue.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Interest rate vs inflation difference
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-card-gradient border-glass-border shadow-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impact Level</CardTitle>
              <BarChart3 className="h-4 w-4 text-accent-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {impactLevel < 1 ? "Low" : impactLevel < 3 ? "Moderate" : "High"}
              </div>
              <p className="text-xs text-muted-foreground">
                {impactLevel.toFixed(1)}% magnitude difference
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Controls */}
        <Card className="backdrop-blur-md bg-card-gradient border-glass-border shadow-glass">
          <CardHeader>
            <CardTitle>Current Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Inflation Rate: {customInflation[0].toFixed(1)}%
                  </label>
                  <Slider
                    value={customInflation}
                    onValueChange={setCustomInflation}
                    min={0}
                    max={15}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Interest Rate: {customInterest[0].toFixed(1)}%
                  </label>
                  <Slider
                    value={customInterest}
                    onValueChange={setCustomInterest}
                    min={0}
                    max={20}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historical Chart */}
        <Card className="backdrop-blur-md bg-card-gradient border-glass-border shadow-glass">
          <CardHeader>
            <CardTitle>Historical Trends (1970-2024)</CardTitle>
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