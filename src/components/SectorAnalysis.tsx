import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, ComposedChart } from 'recharts';
import { Building2, TrendingUp, Users, Briefcase, Heart, Plane, ShoppingCart, Zap, Factory, Home, DollarSign, AlertTriangle, Target, Clock, Shield } from 'lucide-react';

interface SectorData {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  averageInterestRate: number;
  typicalLoanTerms: number[];
  riskProfile: 'low' | 'medium' | 'high';
  growthOutlook: 'declining' | 'stable' | 'growing' | 'booming';
  inflationSensitivity: 'low' | 'medium' | 'high';
  recommendations: string[];
  commonLoanTypes: string[];
  marketConditions: {
    demandTrend: number;
    supplyConstraints: number;
    regulatoryRisk: number;
  };
  financialMetrics: {
    avgDebtToAssets: number;
    avgROE: number;
    avgCurrentRatio: number;
    cyclicalSensitivity: number;
    cashFlowStability: number;
  };
  economicIndicators: {
    gdpSensitivity: number;
    interestSensitivity: number;
    inflationCorrelation: number;
  };
  borrowingProfile: {
    preferredTerms: string[];
    collateralTypes: string[];
    seasonality: 'low' | 'medium' | 'high';
    creditRequirements: 'standard' | 'elevated' | 'premium';
  };
}

interface SectorAnalysisProps {
  currentInflation: number;
  currentInterest: number;
}

const SectorAnalysis: React.FC<SectorAnalysisProps> = ({
  currentInflation,
  currentInterest
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('technology');
  const [timeHorizon, setTimeHorizon] = useState<string>('1year');
  const [riskTolerance, setRiskTolerance] = useState([3]);

  const sectorData: SectorData[] = useMemo(() => [
    {
      id: 'technology',
      name: 'Technology & Software',
      icon: <Zap className="h-4 w-4" />,
      description: 'Software, hardware, AI, and digital transformation companies',
      averageInterestRate: 4.2,
      typicalLoanTerms: [3, 5, 7],
      riskProfile: 'medium',
      growthOutlook: 'growing',
      inflationSensitivity: 'low',
      recommendations: [
        'Leverage during low interest periods for R&D expansion',
        'Equipment financing for hardware and infrastructure',
        'Working capital for scaling operations and talent acquisition',
        'Consider convertible debt for high-growth phases'
      ],
      commonLoanTypes: ['Equipment Financing', 'Working Capital', 'R&D Lines of Credit', 'Revenue-Based Financing'],
      marketConditions: {
        demandTrend: 85,
        supplyConstraints: 30,
        regulatoryRisk: 45
      },
      financialMetrics: {
        avgDebtToAssets: 0.25,
        avgROE: 18.5,
        avgCurrentRatio: 2.1,
        cyclicalSensitivity: 60,
        cashFlowStability: 70
      },
      economicIndicators: {
        gdpSensitivity: 1.2,
        interestSensitivity: -0.8,
        inflationCorrelation: 0.3
      },
      borrowingProfile: {
        preferredTerms: ['3-5 years', 'Flexible repayment', 'Revenue-based options'],
        collateralTypes: ['Equipment', 'IP/Patents', 'Accounts Receivable'],
        seasonality: 'low',
        creditRequirements: 'elevated'
      }
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Life Sciences',
      icon: <Heart className="h-4 w-4" />,
      description: 'Medical services, pharmaceuticals, biotech, and health technology',
      averageInterestRate: 3.8,
      typicalLoanTerms: [5, 7, 10],
      riskProfile: 'low',
      growthOutlook: 'stable',
      inflationSensitivity: 'medium',
      recommendations: [
        'Equipment financing for advanced medical technology',
        'Practice expansion loans at favorable current rates',
        'Real estate investment for medical facilities',
        'R&D financing for pharmaceutical development'
      ],
      commonLoanTypes: ['Equipment Financing', 'Practice Loans', 'Real Estate', 'R&D Financing'],
      marketConditions: {
        demandTrend: 90,
        supplyConstraints: 60,
        regulatoryRisk: 70
      },
      financialMetrics: {
        avgDebtToAssets: 0.35,
        avgROE: 12.8,
        avgCurrentRatio: 1.8,
        cyclicalSensitivity: 25,
        cashFlowStability: 85
      },
      economicIndicators: {
        gdpSensitivity: 0.6,
        interestSensitivity: -0.4,
        inflationCorrelation: -0.2
      },
      borrowingProfile: {
        preferredTerms: ['5-10 years', 'Fixed rates', 'Amortizing loans'],
        collateralTypes: ['Medical Equipment', 'Real Estate', 'Practice Assets'],
        seasonality: 'low',
        creditRequirements: 'standard'
      }
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing & Industrial',
      icon: <Factory className="h-4 w-4" />,
      description: 'Production, assembly, industrial equipment, and supply chain',
      averageInterestRate: 4.5,
      typicalLoanTerms: [7, 10, 15],
      riskProfile: 'medium',
      growthOutlook: 'stable',
      inflationSensitivity: 'high',
      recommendations: [
        'Lock in rates for major capital equipment purchases',
        'Inventory financing to hedge against inflation',
        'Supply chain working capital optimization',
        'Consider green energy financing incentives'
      ],
      commonLoanTypes: ['Equipment Financing', 'Inventory Financing', 'Facilities Loans', 'Working Capital'],
      marketConditions: {
        demandTrend: 70,
        supplyConstraints: 80,
        regulatoryRisk: 55
      },
      financialMetrics: {
        avgDebtToAssets: 0.45,
        avgROE: 14.2,
        avgCurrentRatio: 1.5,
        cyclicalSensitivity: 75,
        cashFlowStability: 65
      },
      economicIndicators: {
        gdpSensitivity: 1.4,
        interestSensitivity: -1.1,
        inflationCorrelation: 0.8
      },
      borrowingProfile: {
        preferredTerms: ['7-15 years', 'Asset-backed', 'Seasonal flexibility'],
        collateralTypes: ['Equipment', 'Inventory', 'Real Estate', 'A/R'],
        seasonality: 'medium',
        creditRequirements: 'standard'
      }
    },
    {
      id: 'retail',
      name: 'Retail & E-commerce',
      icon: <ShoppingCart className="h-4 w-4" />,
      description: 'Consumer goods, retail stores, online commerce, and consumer services',
      averageInterestRate: 5.1,
      typicalLoanTerms: [2, 3, 5],
      riskProfile: 'high',
      growthOutlook: 'growing',
      inflationSensitivity: 'high',
      recommendations: [
        'Short-term inventory financing for seasonal needs',
        'Working capital for digital transformation',
        'Real estate optimization during market shifts',
        'Consider alternative financing for rapid expansion'
      ],
      commonLoanTypes: ['Inventory Financing', 'Working Capital', 'Merchant Cash Advances', 'Asset-Based Lending'],
      marketConditions: {
        demandTrend: 75,
        supplyConstraints: 40,
        regulatoryRisk: 35
      },
      financialMetrics: {
        avgDebtToAssets: 0.38,
        avgROE: 16.7,
        avgCurrentRatio: 1.3,
        cyclicalSensitivity: 85,
        cashFlowStability: 50
      },
      economicIndicators: {
        gdpSensitivity: 1.6,
        interestSensitivity: -1.3,
        inflationCorrelation: 0.9
      },
      borrowingProfile: {
        preferredTerms: ['1-3 years', 'Flexible terms', 'Seasonal adjustments'],
        collateralTypes: ['Inventory', 'A/R', 'Equipment', 'Real Estate'],
        seasonality: 'high',
        creditRequirements: 'elevated'
      }
    },
    {
      id: 'realestate',
      name: 'Real Estate & Construction',
      icon: <Home className="h-4 w-4" />,
      description: 'Property development, construction, investment, and management',
      averageInterestRate: 5.8,
      typicalLoanTerms: [15, 20, 30],
      riskProfile: 'medium',
      growthOutlook: 'stable',
      inflationSensitivity: 'high',
      recommendations: [
        'Lock in rates for long-term development projects',
        'Refinance existing properties during rate dips',
        'Consider inflation-hedged financing structures',
        'Diversify geographic and property type exposure'
      ],
      commonLoanTypes: ['Commercial Mortgages', 'Construction Loans', 'Bridge Financing', 'REIT Financing'],
      marketConditions: {
        demandTrend: 60,
        supplyConstraints: 85,
        regulatoryRisk: 50
      },
      financialMetrics: {
        avgDebtToAssets: 0.65,
        avgROE: 11.5,
        avgCurrentRatio: 1.2,
        cyclicalSensitivity: 90,
        cashFlowStability: 75
      },
      economicIndicators: {
        gdpSensitivity: 1.8,
        interestSensitivity: -2.1,
        inflationCorrelation: 0.7
      },
      borrowingProfile: {
        preferredTerms: ['15-30 years', 'Fixed/ARM options', 'Interest-only periods'],
        collateralTypes: ['Real Estate', 'Development Rights', 'Rental Income'],
        seasonality: 'medium',
        creditRequirements: 'premium'
      }
    },
    {
      id: 'hospitality',
      name: 'Hospitality & Travel',
      icon: <Plane className="h-4 w-4" />,
      description: 'Hotels, restaurants, travel services, and entertainment venues',
      averageInterestRate: 5.5,
      typicalLoanTerms: [5, 7, 10],
      riskProfile: 'high',
      growthOutlook: 'growing',
      inflationSensitivity: 'medium',
      recommendations: [
        'Equipment upgrades for post-pandemic recovery',
        'Expansion financing in recovering markets',
        'Working capital for seasonal fluctuations',
        'Technology investments for operational efficiency'
      ],
      commonLoanTypes: ['SBA Loans', 'Equipment Financing', 'Working Capital', 'Franchise Financing'],
      marketConditions: {
        demandTrend: 80,
        supplyConstraints: 50,
        regulatoryRisk: 40
      },
      financialMetrics: {
        avgDebtToAssets: 0.55,
        avgROE: 13.9,
        avgCurrentRatio: 1.1,
        cyclicalSensitivity: 95,
        cashFlowStability: 45
      },
      economicIndicators: {
        gdpSensitivity: 2.1,
        interestSensitivity: -1.5,
        inflationCorrelation: 0.5
      },
      borrowingProfile: {
        preferredTerms: ['5-10 years', 'Seasonal flexibility', 'Revenue-based options'],
        collateralTypes: ['Real Estate', 'Equipment', 'Business Assets'],
        seasonality: 'high',
        creditRequirements: 'elevated'
      }
    }
  ], []);

  const selectedSectorData = sectorData.find(s => s.id === selectedSector) || sectorData[0];

  // Enhanced borrowing advantage calculation
  const borrowingAdvantage = useMemo(() => {
    const baseAdvantage = currentInflation - selectedSectorData.averageInterestRate;
    const sectorMultiplier = {
      'low': 0.8,
      'medium': 1.0,
      'high': 1.3
    }[selectedSectorData.inflationSensitivity];
    
    const riskAdjustment = {
      'low': 0.2,
      'medium': 0.0,
      'high': -0.3
    }[selectedSectorData.riskProfile];
    
    const timeHorizonMultiplier = {
      '6months': 0.5,
      '1year': 1.0,
      '3years': 1.2,
      '5years': 1.4
    }[timeHorizon] || 1.0;
    
    return (baseAdvantage * sectorMultiplier + riskAdjustment) * timeHorizonMultiplier;
  }, [currentInflation, selectedSectorData, timeHorizon]);

  // Financial health score calculation
  const sectorHealthScore = useMemo(() => {
    const metrics = selectedSectorData.financialMetrics;
    const conditions = selectedSectorData.marketConditions;
    
    // Normalize and weight different factors
    const roe = Math.min(100, (metrics.avgROE / 20) * 100);
    const stability = metrics.cashFlowStability;
    const demand = conditions.demandTrend;
    const regulatory = 100 - conditions.regulatoryRisk;
    
    const weights = { roe: 0.3, stability: 0.3, demand: 0.25, regulatory: 0.15 };
    
    return (roe * weights.roe + 
            stability * weights.stability + 
            demand * weights.demand + 
            regulatory * weights.regulatory);
  }, [selectedSectorData]);

  // Risk-adjusted recommendations
  const riskAdjustedRecommendations = useMemo(() => {
    const riskLevel = riskTolerance[0];
    const sector = selectedSectorData;
    
    let recommendations = [...sector.recommendations];
    
    if (riskLevel <= 2) { // Conservative
      recommendations = recommendations.filter(rec => 
        !rec.toLowerCase().includes('expansion') && 
        !rec.toLowerCase().includes('aggressive')
      );
      recommendations.push('Prioritize secured lending options');
      recommendations.push('Consider shorter loan terms for flexibility');
    } else if (riskLevel >= 4) { // Aggressive
      recommendations.push('Explore growth financing opportunities');
      recommendations.push('Consider leveraging current low rates for expansion');
    }
    
    return recommendations;
  }, [selectedSectorData, riskTolerance]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-beneficial';
      case 'medium': return 'text-warning';
      case 'high': return 'text-risk';
      default: return 'text-muted-foreground';
    }
  };

  const getGrowthColor = (growth: string) => {
    switch (growth) {
      case 'declining': return 'text-risk';
      case 'stable': return 'text-muted-foreground';
      case 'growing': return 'text-beneficial';
      case 'booming': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  // Enhanced visualization data
  const marketConditionsData = [
    { name: 'Demand Trend', value: selectedSectorData.marketConditions.demandTrend, color: 'hsl(var(--beneficial))' },
    { name: 'Supply Constraints', value: selectedSectorData.marketConditions.supplyConstraints, color: 'hsl(var(--risk))' },
    { name: 'Regulatory Risk', value: selectedSectorData.marketConditions.regulatoryRisk, color: 'hsl(var(--warning))' }
  ];

  const financialHealthData = [
    { subject: 'ROE', value: Math.min(100, (selectedSectorData.financialMetrics.avgROE / 25) * 100) },
    { subject: 'Cash Flow Stability', value: selectedSectorData.financialMetrics.cashFlowStability },
    { subject: 'Current Ratio', value: Math.min(100, (selectedSectorData.financialMetrics.avgCurrentRatio / 3) * 100) },
    { subject: 'Market Demand', value: selectedSectorData.marketConditions.demandTrend },
    { subject: 'Growth Outlook', value: getGrowthScore(selectedSectorData.growthOutlook) },
    { subject: 'Risk Profile', value: 100 - getRiskScore(selectedSectorData.riskProfile) }
  ];

  const sectorComparison = sectorData.map(sector => {
    const advantage = currentInflation - sector.averageInterestRate;
    const healthScore = calculateHealthScore(sector);
    
    return {
      name: sector.name,
      rate: sector.averageInterestRate,
      advantage,
      health: healthScore,
      risk: getRiskScore(sector.riskProfile)
    };
  });

  // Economic sensitivity analysis
  const sensitivityData = [
    { name: 'GDP Growth', current: selectedSectorData.economicIndicators.gdpSensitivity, projected: selectedSectorData.economicIndicators.gdpSensitivity * 1.1 },
    { name: 'Interest Rates', current: Math.abs(selectedSectorData.economicIndicators.interestSensitivity), projected: Math.abs(selectedSectorData.economicIndicators.interestSensitivity) * 0.9 },
    { name: 'Inflation', current: Math.abs(selectedSectorData.economicIndicators.inflationCorrelation * 100), projected: Math.abs(selectedSectorData.economicIndicators.inflationCorrelation * 100) * 1.2 }
  ];

  // Helper functions
  function getRiskScore(risk: string) {
    switch (risk) {
      case 'low': return 20;
      case 'medium': return 50;
      case 'high': return 80;
      default: return 50;
    }
  }

  function getGrowthScore(growth: string) {
    switch (growth) {
      case 'declining': return 20;
      case 'stable': return 50;
      case 'growing': return 75;
      case 'booming': return 95;
      default: return 50;
    }
  }

  function calculateHealthScore(sector: SectorData) {
    const metrics = sector.financialMetrics;
    const conditions = sector.marketConditions;
    
    const roe = Math.min(100, (metrics.avgROE / 20) * 100);
    const stability = metrics.cashFlowStability;
    const demand = conditions.demandTrend;
    const regulatory = 100 - conditions.regulatoryRisk;
    
    return (roe * 0.3 + stability * 0.3 + demand * 0.25 + regulatory * 0.15);
  }

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Advanced Sector Analysis
        </CardTitle>
        <CardDescription>
          Comprehensive industry-specific financial analysis with risk assessment and market intelligence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enhanced Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Industry Sector</Label>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="hover:scale-105 transition-transform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sectorData.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    <div className="flex items-center gap-2">
                      {sector.icon}
                      {sector.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Investment Horizon</Label>
            <Select value={timeHorizon} onValueChange={setTimeHorizon}>
              <SelectTrigger className="hover:scale-105 transition-transform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="3years">3 Years</SelectItem>
                <SelectItem value="5years">5+ Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Risk Tolerance: {riskTolerance[0]}/5</Label>
            <Slider
              value={riskTolerance}
              onValueChange={setRiskTolerance}
              max={5}
              min={1}
              step={1}
              className="hover:scale-105 transition-transform"
            />
            <div className="text-xs text-muted-foreground text-center">
              {riskTolerance[0] <= 2 ? 'Conservative' : riskTolerance[0] >= 4 ? 'Aggressive' : 'Moderate'}
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">Financial Health</TabsTrigger>
            <TabsTrigger value="market">Market Intelligence</TabsTrigger>
            <TabsTrigger value="comparison">Sector Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            {/* Enhanced Sector Header */}
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    {selectedSectorData.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedSectorData.name}</h3>
                    <p className="text-muted-foreground">{selectedSectorData.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {sectorHealthScore.toFixed(0)}% Health Score
                      </Badge>
                      <Badge 
                        variant={borrowingAdvantage > 0 ? "default" : "secondary"}
                        className="flex items-center gap-1"
                      >
                        <TrendingUp className="h-3 w-3" />
                        {borrowingAdvantage > 0 ? '+' : ''}{borrowingAdvantage.toFixed(2)}% Advantage
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{selectedSectorData.averageInterestRate}%</div>
                  <div className="text-sm text-muted-foreground">Avg. Interest Rate</div>
                </div>
              </div>
            </Card>

            {/* Enhanced Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 hover:scale-105 transition-transform animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-medium text-muted-foreground">Risk Level</div>
                </div>
                <div className={`text-lg font-bold capitalize ${getRiskColor(selectedSectorData.riskProfile)}`}>
                  {selectedSectorData.riskProfile}
                </div>
                <Progress value={getRiskScore(selectedSectorData.riskProfile)} className="h-2 mt-2" />
              </Card>
              
              <Card className="p-4 hover:scale-105 transition-transform animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-medium text-muted-foreground">Growth Outlook</div>
                </div>
                <div className={`text-lg font-bold capitalize ${getGrowthColor(selectedSectorData.growthOutlook)}`}>
                  {selectedSectorData.growthOutlook}
                </div>
                <Progress value={getGrowthScore(selectedSectorData.growthOutlook)} className="h-2 mt-2" />
              </Card>
              
              <Card className="p-4 hover:scale-105 transition-transform animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-medium text-muted-foreground">Inflation Sensitivity</div>
                </div>
                <div className={`text-lg font-bold capitalize ${getRiskColor(selectedSectorData.inflationSensitivity)}`}>
                  {selectedSectorData.inflationSensitivity}
                </div>
                <Progress value={selectedSectorData.inflationSensitivity === 'high' ? 80 : selectedSectorData.inflationSensitivity === 'medium' ? 50 : 25} className="h-2 mt-2" />
              </Card>
              
              <Card className="p-4 hover:scale-105 transition-transform animate-fade-in" style={{animationDelay: '0.4s'}}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-medium text-muted-foreground">Avg ROE</div>
                </div>
                <div className="text-lg font-bold text-beneficial">
                  {selectedSectorData.financialMetrics.avgROE.toFixed(1)}%
                </div>
                <Progress value={(selectedSectorData.financialMetrics.avgROE / 25) * 100} className="h-2 mt-2" />
              </Card>
            </div>

            {/* Enhanced Recommendations & Loan Types */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 animate-fade-in" style={{animationDelay: '0.5s'}}>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Risk-Adjusted Recommendations
                </h4>
                <ul className="space-y-3">
                  {riskAdjustedRecommendations.map((rec, index) => (
                    <li key={`rec-${index}`} className="text-sm flex items-start gap-2">
                      <TrendingUp className="h-3 w-3 mt-1 text-beneficial flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </Card>
              
              <Card className="p-6 animate-fade-in" style={{animationDelay: '0.6s'}}>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Financing Options & Terms
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Common Loan Types:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSectorData.commonLoanTypes.map((type, index) => (
                        <Badge key={`loan-type-${index}`} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Typical Terms:</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedSectorData.typicalLoanTerms.join(', ')} years
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Preferred Structure:</div>
                    <div className="space-y-1">
                      {selectedSectorData.borrowingProfile.preferredTerms.map((term, index) => (
                        <div key={`term-${index}`} className="text-xs text-muted-foreground flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {term}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Financial Health Radar */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Financial Health Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={financialHealthData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" fontSize={10} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={8} />
                        <Radar
                          name="Health Score"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Health Score</span>
                      <Badge variant={sectorHealthScore > 70 ? "default" : sectorHealthScore > 50 ? "secondary" : "destructive"}>
                        {sectorHealthScore.toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={sectorHealthScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Market Conditions */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Market Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marketConditionsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                          nameKey="name"
                        >
                          {marketConditionsData.map((entry, index) => (
                            <Cell key={`market-condition-${entry.name}-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm mt-4">
                    {marketConditionsData.map((condition) => (
                      <div key={`condition-${condition.name}`} className="flex items-center justify-between p-2 rounded border">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: condition.color }}
                          />
                          {condition.name}
                        </div>
                        <span className="font-medium">{condition.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Economic Sensitivity Analysis */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Economic Sensitivity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={sensitivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="current" fill="hsl(var(--primary))" name="Current Sensitivity" />
                      <Line type="monotone" dataKey="projected" stroke="hsl(var(--beneficial))" name="Projected" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 rounded-lg border">
                    <div className="text-sm text-muted-foreground">GDP Sensitivity</div>
                    <div className="text-lg font-bold">{selectedSectorData.economicIndicators.gdpSensitivity.toFixed(1)}x</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border">
                    <div className="text-sm text-muted-foreground">Interest Sensitivity</div>
                    <div className="text-lg font-bold">{selectedSectorData.economicIndicators.interestSensitivity.toFixed(1)}x</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border">
                    <div className="text-sm text-muted-foreground">Inflation Correlation</div>
                    <div className="text-lg font-bold">{selectedSectorData.economicIndicators.inflationCorrelation.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-6 animate-fade-in">
            {/* Borrowing Timeline */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Strategic Borrowing Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border-l-4 border-l-beneficial bg-beneficial/5">
                    <div>
                      <div className="font-medium">Immediate (0-3 months)</div>
                      <div className="text-sm text-muted-foreground">
                        {borrowingAdvantage > 0 ? 'Highly favorable conditions for borrowing' : 'Evaluate alternatives before borrowing'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Current advantage: {borrowingAdvantage.toFixed(2)}%
                      </div>
                    </div>
                    <Badge variant={borrowingAdvantage > 1 ? "default" : borrowingAdvantage > 0 ? "secondary" : "destructive"}>
                      {borrowingAdvantage > 1 ? 'Excellent' : borrowingAdvantage > 0 ? 'Good' : 'Caution'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border-l-4 border-l-primary bg-primary/5">
                    <div>
                      <div className="font-medium">Near-term (3-12 months)</div>
                      <div className="text-sm text-muted-foreground">
                        Monitor rate trends and sector-specific developments
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Health score: {sectorHealthScore.toFixed(0)}%
                      </div>
                    </div>
                    <Badge variant="outline">Monitor</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border-l-4 border-l-warning bg-warning/5">
                    <div>
                      <div className="font-medium">Long-term (1+ years)</div>
                      <div className="text-sm text-muted-foreground">
                        Strategic positioning based on sector growth outlook
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Growth outlook: {selectedSectorData.growthOutlook}
                      </div>
                    </div>
                    <Badge variant="outline">Strategic</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Borrowing Profile Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Borrowing Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Collateral Types</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSectorData.borrowingProfile.collateralTypes.map((type, index) => (
                        <Badge key={`collateral-${index}`} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Seasonality Impact</div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={selectedSectorData.borrowingProfile.seasonality === 'high' ? 80 : 
                               selectedSectorData.borrowingProfile.seasonality === 'medium' ? 50 : 25} 
                        className="flex-1 h-2" 
                      />
                      <span className="text-sm font-medium capitalize">{selectedSectorData.borrowingProfile.seasonality}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Credit Requirements</div>
                    <Badge 
                      variant={selectedSectorData.borrowingProfile.creditRequirements === 'premium' ? 'destructive' : 
                              selectedSectorData.borrowingProfile.creditRequirements === 'elevated' ? 'secondary' : 'default'}
                    >
                      {selectedSectorData.borrowingProfile.creditRequirements}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Financial Metrics</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Debt-to-Assets</div>
                      <div className="text-lg font-bold">{(selectedSectorData.financialMetrics.avgDebtToAssets * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Current Ratio</div>
                      <div className="text-lg font-bold">{selectedSectorData.financialMetrics.avgCurrentRatio.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Cash Flow Stability</div>
                      <div className="text-lg font-bold">{selectedSectorData.financialMetrics.cashFlowStability}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Cyclical Sensitivity</div>
                      <div className="text-lg font-bold">{selectedSectorData.financialMetrics.cyclicalSensitivity}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorComparison}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    className="text-xs fill-muted-foreground"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(2)}%`, 
                      name === 'advantage' ? 'Borrowing Advantage' : 'Interest Rate'
                    ]}
                    labelFormatter={(label) => `${label} Sector`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="rate" fill="hsl(var(--muted))" name="rate" />
                  <Bar 
                    dataKey="advantage" 
                    fill="hsl(var(--primary))" 
                    name="advantage"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm text-muted-foreground">
              Comparing average interest rates and current borrowing advantage across sectors
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SectorAnalysis;