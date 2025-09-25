import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Play, RotateCcw, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SimulationResult {
  scenario: number;
  year: number;
  inflationRate: number;
  interestRate: number;
  netBenefit: number;
  cumulativeBenefit: number;
}

interface MonteCarloProps {
  currentInflation: number;
  customInterest: number;
}

const MonteCarloSimulation: React.FC<MonteCarloProps> = ({
  currentInflation,
  customInterest
}) => {
  const [simulations, setSimulations] = useState(1000);
  const [years, setYears] = useState(10);
  const [volatility, setVolatility] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);

  // Generate random walk for economic variables
  const generateRandomWalk = (initial: number, years: number, volatility: number) => {
    const path = [initial];
    for (let i = 1; i < years; i++) {
      const shock = (Math.random() - 0.5) * 2 * volatility;
      const meanReversion = (initial - path[i-1]) * 0.1; // Slight mean reversion
      const nextValue = Math.max(0, path[i-1] + shock + meanReversion);
      path.push(nextValue);
    }
    return path;
  };

  const runSimulation = async () => {
    setIsRunning(true);
    const newResults: SimulationResult[] = [];

    // Run simulations in batches to prevent UI blocking
    const batchSize = 50;
    for (let batch = 0; batch < Math.ceil(simulations / batchSize); batch++) {
      const batchResults: SimulationResult[] = [];
      
      for (let sim = batch * batchSize; sim < Math.min((batch + 1) * batchSize, simulations); sim++) {
        const inflationPath = generateRandomWalk(currentInflation, years, volatility);
        const interestPath = generateRandomWalk(customInterest, years, volatility * 0.8);
        
        let cumulativeBenefit = 0;
        for (let year = 0; year < years; year++) {
          const netBenefit = inflationPath[year] - interestPath[year];
          cumulativeBenefit += netBenefit;
          
          batchResults.push({
            scenario: sim,
            year,
            inflationRate: inflationPath[year],
            interestRate: interestPath[year],
            netBenefit,
            cumulativeBenefit
          });
        }
      }
      
      newResults.push(...batchResults);
      
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    setResults(newResults);
    setIsRunning(false);
  };

  const analysisData = useMemo(() => {
    if (results.length === 0) return null;

    // Group by year for percentile analysis
    const yearlyData = [];
    for (let year = 0; year < years; year++) {
      const yearResults = results
        .filter(r => r.year === year)
        .map(r => r.cumulativeBenefit)
        .sort((a, b) => a - b);

      const percentile = (p: number) => {
        const index = Math.floor(p * yearResults.length);
        return yearResults[index] || 0;
      };

      yearlyData.push({
        year: year + 1,
        p10: percentile(0.1),
        p25: percentile(0.25),
        p50: percentile(0.5),
        p75: percentile(0.75),
        p90: percentile(0.9),
        mean: yearResults.reduce((a, b) => a + b, 0) / yearResults.length
      });
    }

    // Calculate key statistics
    const finalBenefits = results
      .filter(r => r.year === years - 1)
      .map(r => r.cumulativeBenefit);

    const positiveOutcomes = finalBenefits.filter(b => b > 0).length;
    const probabilityOfBenefit = (positiveOutcomes / finalBenefits.length) * 100;
    
    const averageBenefit = finalBenefits.reduce((a, b) => a + b, 0) / finalBenefits.length;
    const worstCase = Math.min(...finalBenefits);
    const bestCase = Math.max(...finalBenefits);

    return {
      yearlyData,
      probabilityOfBenefit,
      averageBenefit,
      worstCase,
      bestCase,
      totalScenarios: simulations
    };
  }, [results, years, simulations]);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Monte Carlo Simulation
        </CardTitle>
        <CardDescription>
          Probabilistic analysis of borrowing outcomes over time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Simulations: {simulations}</label>
            <Slider
              value={[simulations]}
              onValueChange={([value]) => setSimulations(value)}
              min={100}
              max={5000}
              step={100}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Years: {years}</label>
            <Slider
              value={[years]}
              onValueChange={([value]) => setYears(value)}
              min={5}
              max={30}
              step={1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Volatility: {volatility}%</label>
            <Slider
              value={[volatility]}
              onValueChange={([value]) => setVolatility(value)}
              min={0.5}
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        {/* Run Button */}
        <div className="flex gap-2">
          <Button 
            onClick={runSimulation} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Simulation
              </>
            )}
          </Button>
          {results.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setResults([])}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>

        {/* Results */}
        {analysisData && (
          <div className="space-y-6">
            {/* Key Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`h-4 w-4 ${analysisData.probabilityOfBenefit > 50 ? 'text-beneficial' : 'text-risk'}`} />
                  <span className="text-sm font-medium">Success Rate</span>
                </div>
                <div className="text-2xl font-bold">{analysisData.probabilityOfBenefit.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Positive outcomes</div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Avg. Benefit</span>
                </div>
                <div className="text-2xl font-bold">{analysisData.averageBenefit.toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">Expected value</div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-risk" />
                  <span className="text-sm font-medium">Worst Case</span>
                </div>
                <div className="text-2xl font-bold">{analysisData.worstCase.toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">5th percentile</div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-beneficial" />
                  <span className="text-sm font-medium">Best Case</span>
                </div>
                <div className="text-2xl font-bold">{analysisData.bestCase.toFixed(2)}%</div>
                <div className="text-xs text-muted-foreground">95th percentile</div>
              </Card>
            </div>

            {/* Probability Distribution Chart */}
            <div className="h-80">
              <h3 className="text-lg font-semibold mb-4">Outcome Distribution Over Time</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analysisData.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="year" 
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      const labels = {
                        p10: '10th Percentile',
                        p25: '25th Percentile', 
                        p50: 'Median',
                        p75: '75th Percentile',
                        p90: '90th Percentile',
                        mean: 'Average'
                      };
                      return [`${value.toFixed(2)}%`, labels[name as keyof typeof labels] || name];
                    }}
                    labelFormatter={(label) => `Year ${label}`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  
                  <Area dataKey="p90" stackId="1" stroke="none" fill="hsl(var(--beneficial) / 0.1)" />
                  <Area dataKey="p75" stackId="2" stroke="none" fill="hsl(var(--beneficial) / 0.2)" />
                  <Area dataKey="p50" stackId="3" stroke="none" fill="hsl(var(--beneficial) / 0.3)" />
                  <Area dataKey="p25" stackId="4" stroke="none" fill="hsl(var(--risk) / 0.2)" />
                  <Area dataKey="p10" stackId="5" stroke="none" fill="hsl(var(--risk) / 0.1)" />
                  
                  <Line 
                    type="monotone" 
                    dataKey="mean" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="text-sm text-muted-foreground">
              Based on {analysisData.totalScenarios.toLocaleString()} simulations with {volatility}% annual volatility
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonteCarloSimulation;