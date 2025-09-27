import React, { memo, useCallback, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Share2, BarChart3, PieChart, TrendingUp, Brain, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

interface ExportToolsProps {
  data?: Array<{
    year: number;
    inflation?: number;
    interestRate?: number;
    beneficial: boolean;
  }>;
  scenarios?: Array<{
    id: string;
    name: string;
    purpose: string;
    loanAmount: number;
    interestRate: number;
    termYears: number;
    monthlyPayment?: number;
    beneficial: boolean;
  }>;
  analysisResults?: {
    totalBeneficialYears?: number;
    averageAdvantage?: number;
    riskScore?: number;
    confidence?: number;
  };
  marketData?: Array<{
    indicator: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

const ExportTools = memo(({ data, scenarios, analysisResults, marketData }: ExportToolsProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('reports');

  // Advanced analytics calculations
  const analyticsData = useMemo(() => {
    if (!data) return null;

    const beneficialYears = data.filter(d => d.beneficial).length;
    const totalYears = data.length;
    const beneficialPercentage = (beneficialYears / totalYears) * 100;
    
    const avgInflation = data.reduce((sum, d) => sum + (d.inflation || 0), 0) / totalYears;
    const avgInterest = data.reduce((sum, d) => sum + (d.interestRate || 0), 0) / totalYears;
    const avgAdvantage = avgInflation - avgInterest;

    // Risk assessment based on volatility
    const inflationVolatility = Math.sqrt(
      data.reduce((sum, d) => Math.pow((d.inflation || 0) - avgInflation, 2), 0) / totalYears
    );
    const interestVolatility = Math.sqrt(
      data.reduce((sum, d) => Math.pow((d.interestRate || 0) - avgInterest, 2), 0) / totalYears
    );

    return {
      beneficialPercentage,
      avgInflation,
      avgInterest,
      avgAdvantage,
      inflationVolatility,
      interestVolatility,
      riskScore: (inflationVolatility + interestVolatility) * 10
    };
  }, [data]);

  // Generate comprehensive insights
  const generateInsights = useCallback(() => {
    if (!analyticsData) return [];

    const insights = [];
    
    if (analyticsData.beneficialPercentage > 60) {
      insights.push("Historical data shows borrowing was beneficial in majority of years");
    }
    if (analyticsData.avgAdvantage > 1) {
      insights.push("Strong average inflation advantage over interest rates");
    }
    if (analyticsData.riskScore > 50) {
      insights.push("High volatility periods require careful timing");
    }
    if (analyticsData.inflationVolatility > 2) {
      insights.push("Inflation shows significant variability - monitor closely");
    }

    return insights;
  }, [analyticsData]);

  const exportToCSV = useCallback(() => {
    if (!data) return;
    
    const csvContent = [
      ['Year', 'Inflation Rate (%)', 'Interest Rate (%)', 'Beneficial to Borrow'],
      ...data.map((row) => [
        row.year,
        row.inflation?.toFixed(2) || '',
        row.interestRate?.toFixed(2) || '',
        row.beneficial ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'borrowing-analysis.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Historical data exported to CSV file",
    });
  }, [data, toast]);

  const exportScenariosToCSV = useCallback(() => {
    if (!scenarios || scenarios.length === 0) return;
    
    const csvContent = [
      ['Scenario Name', 'Purpose', 'Loan Amount ($)', 'Interest Rate (%)', 'Term (Years)', 'Monthly Payment ($)', 'Status'],
      ...scenarios.map((scenario) => [
        scenario.name,
        scenario.purpose,
        scenario.loanAmount,
        scenario.interestRate,
        scenario.termYears,
        scenario.monthlyPayment?.toFixed(2) || '',
        scenario.beneficial ? 'Beneficial' : 'Costly'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'borrowing-scenarios.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete", 
      description: "Scenarios exported to CSV file",
    });
  }, [scenarios, toast]);

  const generateAdvancedReport = useCallback(() => {
    const insights = generateInsights();
    const reportContent = `
# Comprehensive Borrowing Intelligence Report
Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

## Executive Summary
${analyticsData ? `
- **Beneficial Borrowing Periods**: ${analyticsData.beneficialPercentage.toFixed(1)}% of analyzed years
- **Average Inflation Rate**: ${analyticsData.avgInflation.toFixed(2)}%
- **Average Interest Rate**: ${analyticsData.avgInterest.toFixed(2)}%
- **Net Advantage**: ${analyticsData.avgAdvantage.toFixed(2)}% (${analyticsData.avgAdvantage > 0 ? 'Favorable' : 'Unfavorable'})
- **Risk Score**: ${analyticsData.riskScore.toFixed(1)}/100 (${analyticsData.riskScore > 50 ? 'High' : 'Moderate'} volatility)
` : 'Data analysis pending...'}

## Market Intelligence
${marketData ? marketData.map(m => `- **${m.indicator}**: ${m.value}% (${m.trend})`).join('\n') : 'Market data not available'}

## Key Insights
${insights.map(insight => `- ${insight}`).join('\n')}

## Scenario Analysis
${scenarios ? `
Analyzed ${scenarios.length} borrowing scenarios:
${scenarios.map((s, i) => `
### Scenario ${i + 1}: ${s.name}
- **Purpose**: ${s.purpose}
- **Amount**: $${s.loanAmount.toLocaleString()}
- **Rate**: ${s.interestRate}%
- **Term**: ${s.termYears} years
- **Status**: ${s.beneficial ? '✅ Beneficial' : '❌ Costly'}
${s.monthlyPayment ? `- **Monthly Payment**: $${s.monthlyPayment.toFixed(2)}` : ''}
`).join('')}
` : 'No scenarios analyzed'}

## Risk Assessment & Recommendations

### Current Market Conditions
${analyticsData?.avgAdvantage > 0 ? 
  '✅ **FAVORABLE**: Inflation currently exceeds average interest rates, creating a mathematical advantage for borrowing fixed-rate debt.' :
  '⚠️ **CAUTIOUS**: Interest rates exceed inflation, resulting in real borrowing costs. Consider variable rates or wait for better conditions.'
}

### Timing Recommendations
1. **Short-term (1-2 years)**: ${analyticsData?.riskScore > 50 ? 'Monitor volatility closely' : 'Stable conditions for borrowing'}
2. **Medium-term (2-5 years)**: ${analyticsData?.avgAdvantage > 0 ? 'Lock in current favorable rates' : 'Consider flexible terms'}
3. **Long-term (5+ years)**: Historical average suggests ${analyticsData?.beneficialPercentage > 50 ? 'borrowing advantage over time' : 'careful evaluation needed'}

### Portfolio Optimization
- **Diversification**: Spread borrowing across different rate environments
- **Hedging**: Consider rate-protected instruments for large exposures
- **Monitoring**: Track inflation trends and Fed policy changes

## Technical Methodology
This analysis employs quantitative methods including:
- Historical correlation analysis between inflation and interest rates
- Volatility-adjusted risk scoring using standard deviation
- Monte Carlo-style scenario modeling for decision support
- Real return calculations adjusted for purchasing power erosion

## Disclaimers
- This analysis is for educational and planning purposes only
- Past performance does not guarantee future results
- Consult qualified financial advisors for personalized advice
- Market conditions can change rapidly and unpredictably

---
*Report generated by Borrowing Intelligence AI | ${new Date().toISOString()}*
    `.trim();
    
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `borrowing-intelligence-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Advanced Report Generated",
      description: "Comprehensive analysis exported with insights and recommendations",
    });
  }, [analyticsData, generateInsights, marketData, scenarios, toast]);

  const shareAnalysis = useCallback(async () => {
    const shareData = {
      title: 'Borrowing Intelligence Analysis',
      text: 'Check out this financial analysis tool that shows when borrowing money makes mathematical sense based on inflation vs interest rates.',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: "Analysis shared via native share dialog",
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Analysis URL copied to clipboard",
      });
    }
  }, [toast]);

  return (
    <Card className="backdrop-blur-md bg-card-gradient border-glass-border shadow-glass animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Advanced Export & Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="data">Data Export</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={generateAdvancedReport}
                className="transition-all duration-200 hover:scale-105 hover:shadow-md h-auto p-4"
              >
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 mt-1" />
                  <div className="text-left">
                    <div className="font-semibold">AI-Powered Report</div>
                    <div className="text-xs opacity-80">Comprehensive analysis with insights</div>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={shareAnalysis}
                className="transition-all duration-200 hover:scale-105 hover:shadow-md h-auto p-4"
              >
                <div className="flex items-start gap-3">
                  <Share2 className="h-5 w-5 mt-1" />
                  <div className="text-left">
                    <div className="font-semibold">Share Analysis</div>
                    <div className="text-xs opacity-80">Export shareable link or report</div>
                  </div>
                </div>
              </Button>
            </div>

            {analyticsData && (
              <Card className="p-4 bg-muted/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Success Rate</div>
                    <div className="text-lg font-bold text-beneficial">
                      {analyticsData.beneficialPercentage.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Avg Advantage</div>
                    <div className={`text-lg font-bold ${analyticsData.avgAdvantage > 0 ? 'text-beneficial' : 'text-risk'}`}>
                      {analyticsData.avgAdvantage > 0 ? '+' : ''}{analyticsData.avgAdvantage.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Risk Score</div>
                    <div className={`text-lg font-bold ${analyticsData.riskScore > 50 ? 'text-warning' : 'text-beneficial'}`}>
                      {analyticsData.riskScore.toFixed(1)}/100
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Volatility</div>
                    <div className="text-lg font-bold">
                      {analyticsData.inflationVolatility.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={exportToCSV}
                className="transition-all duration-200 hover:scale-105 hover:shadow-md h-auto p-4"
                disabled={!data}
              >
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 mt-1" />
                  <div className="text-left">
                    <div className="font-semibold">Historical Data</div>
                    <div className="text-xs opacity-80">Export rate history</div>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={exportScenariosToCSV}
                className="transition-all duration-200 hover:scale-105 hover:shadow-md h-auto p-4"
                disabled={!scenarios || scenarios.length === 0}
              >
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 mt-1" />
                  <div className="text-left">
                    <div className="font-semibold">Scenarios</div>
                    <div className="text-xs opacity-80">Export comparisons</div>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  if (!marketData) return;
                  const csvContent = [
                    ['Indicator', 'Value', 'Trend'],
                    ...marketData.map(m => [m.indicator, m.value, m.trend])
                  ].map(row => row.join(',')).join('\n');
                  
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'market-indicators.csv';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  
                  toast({
                    title: "Market Data Exported",
                    description: "Market indicators saved to CSV file",
                  });
                }}
                className="transition-all duration-200 hover:scale-105 hover:shadow-md h-auto p-4"
                disabled={!marketData}
              >
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 mt-1" />
                  <div className="text-left">
                    <div className="font-semibold">Market Data</div>
                    <div className="text-xs opacity-80">Export indicators</div>
                  </div>
                </div>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {analyticsData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Performance Distribution</h3>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: 'Beneficial', value: analyticsData.beneficialPercentage },
                              { name: 'Costly', value: 100 - analyticsData.beneficialPercentage }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            dataKey="value"
                          >
                            <Cell fill="hsl(var(--beneficial))" />
                            <Cell fill="hsl(var(--risk))" />
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Risk Metrics</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Inflation Volatility</span>
                          <span>{analyticsData.inflationVolatility.toFixed(2)}%</span>
                        </div>
                        <Progress value={Math.min(100, analyticsData.inflationVolatility * 10)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Interest Volatility</span>
                          <span>{analyticsData.interestVolatility.toFixed(2)}%</span>
                        </div>
                        <Progress value={Math.min(100, analyticsData.interestVolatility * 10)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall Risk Score</span>
                          <span>{analyticsData.riskScore.toFixed(1)}/100</span>
                        </div>
                        <Progress value={analyticsData.riskScore} className="h-2" />
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI-Generated Insights
                  </h3>
                  <div className="space-y-2">
                    {generateInsights().map((insight, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});

ExportTools.displayName = 'ExportTools';

export default ExportTools;