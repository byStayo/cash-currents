import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building2, TrendingUp, Users, Briefcase, Heart, Plane, ShoppingCart, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  const sectorData: SectorData[] = useMemo(() => [
    {
      id: 'technology',
      name: 'Technology',
      icon: <Zap className="h-4 w-4" />,
      description: 'Software, hardware, and digital services companies',
      averageInterestRate: 4.2,
      typicalLoanTerms: [3, 5, 7],
      riskProfile: 'medium',
      growthOutlook: 'growing',
      inflationSensitivity: 'low',
      recommendations: [
        'Leverage during low interest periods for R&D',
        'Consider equipment financing for hardware',
        'Working capital for scaling operations'
      ],
      commonLoanTypes: ['Equipment Financing', 'Working Capital', 'R&D Lines of Credit'],
      marketConditions: {
        demandTrend: 85,
        supplyConstraints: 30,
        regulatoryRisk: 45
      }
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: <Heart className="h-4 w-4" />,
      description: 'Medical services, pharmaceuticals, and health technology',
      averageInterestRate: 3.8,
      typicalLoanTerms: [5, 7, 10],
      riskProfile: 'low',
      growthOutlook: 'stable',
      inflationSensitivity: 'medium',
      recommendations: [
        'Equipment financing for medical devices',
        'Practice expansion loans at current rates',
        'Consider real estate investment'
      ],
      commonLoanTypes: ['Equipment Financing', 'Practice Loans', 'Real Estate'],
      marketConditions: {
        demandTrend: 90,
        supplyConstraints: 60,
        regulatoryRisk: 70
      }
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      icon: <Building2 className="h-4 w-4" />,
      description: 'Production, assembly, and industrial operations',
      averageInterestRate: 4.5,
      typicalLoanTerms: [7, 10, 15],
      riskProfile: 'medium',
      growthOutlook: 'stable',
      inflationSensitivity: 'high',
      recommendations: [
        'Lock in rates for capital equipment',
        'Inventory financing during inflation',
        'Supply chain working capital'
      ],
      commonLoanTypes: ['Equipment Financing', 'Inventory Financing', 'Facilities Loans'],
      marketConditions: {
        demandTrend: 70,
        supplyConstraints: 80,
        regulatoryRisk: 55
      }
    },
    {
      id: 'retail',
      name: 'Retail & E-commerce',
      icon: <ShoppingCart className="h-4 w-4" />,
      description: 'Consumer goods, retail stores, and online commerce',
      averageInterestRate: 5.1,
      typicalLoanTerms: [2, 3, 5],
      riskProfile: 'high',
      growthOutlook: 'growing',
      inflationSensitivity: 'high',
      recommendations: [
        'Short-term inventory financing',
        'Seasonal working capital',
        'E-commerce platform investments'
      ],
      commonLoanTypes: ['Inventory Financing', 'Working Capital', 'Merchant Cash Advances'],
      marketConditions: {
        demandTrend: 75,
        supplyConstraints: 40,
        regulatoryRisk: 35
      }
    },
    {
      id: 'realestate',
      name: 'Real Estate',
      icon: <Building2 className="h-4 w-4" />,
      description: 'Property development, investment, and management',
      averageInterestRate: 5.8,
      typicalLoanTerms: [15, 20, 30],
      riskProfile: 'medium',
      growthOutlook: 'stable',
      inflationSensitivity: 'high',
      recommendations: [
        'Consider rate locks for development',
        'Refinance existing properties',
        'Commercial property expansion'
      ],
      commonLoanTypes: ['Commercial Mortgages', 'Construction Loans', 'Bridge Financing'],
      marketConditions: {
        demandTrend: 60,
        supplyConstraints: 85,
        regulatoryRisk: 50
      }
    },
    {
      id: 'hospitality',
      name: 'Hospitality & Travel',
      icon: <Plane className="h-4 w-4" />,
      description: 'Hotels, restaurants, travel, and entertainment services',
      averageInterestRate: 5.5,
      typicalLoanTerms: [5, 7, 10],
      riskProfile: 'high',
      growthOutlook: 'growing',
      inflationSensitivity: 'medium',
      recommendations: [
        'Equipment upgrades during recovery',
        'Expansion financing opportunities',
        'Working capital for seasonality'
      ],
      commonLoanTypes: ['SBA Loans', 'Equipment Financing', 'Working Capital'],
      marketConditions: {
        demandTrend: 80,
        supplyConstraints: 50,
        regulatoryRisk: 40
      }
    }
  ], []);

  const selectedSectorData = sectorData.find(s => s.id === selectedSector) || sectorData[0];

  const borrowingAdvantage = useMemo(() => {
    const rateSpread = currentInflation - selectedSectorData.averageInterestRate;
    const sectorMultiplier = {
      'low': 0.8,
      'medium': 1.0,
      'high': 1.3
    }[selectedSectorData.inflationSensitivity];
    
    return rateSpread * sectorMultiplier;
  }, [currentInflation, selectedSectorData]);

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

  const marketConditionsData = [
    { name: 'Demand Trend', value: selectedSectorData.marketConditions.demandTrend, color: '#22c55e' },
    { name: 'Supply Constraints', value: selectedSectorData.marketConditions.supplyConstraints, color: '#ef4444' },
    { name: 'Regulatory Risk', value: selectedSectorData.marketConditions.regulatoryRisk, color: '#f59e0b' }
  ];

  const sectorComparison = sectorData.map(sector => ({
    name: sector.name,
    rate: sector.averageInterestRate,
    advantage: currentInflation - sector.averageInterestRate,
    risk: sector.riskProfile
  }));

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Sector-Specific Analysis
        </CardTitle>
        <CardDescription>
          Industry-tailored borrowing strategies and market insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sector Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Industry Sector</label>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger>
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

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Sector Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Sector Info Header */}
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {selectedSectorData.icon}
                  <div>
                    <h3 className="text-lg font-semibold">{selectedSectorData.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSectorData.description}</p>
                  </div>
                </div>
                <Badge 
                  className={`${borrowingAdvantage > 0 ? 'bg-beneficial/20 text-beneficial' : 'bg-risk/20 text-risk'}`}
                >
                  {borrowingAdvantage > 0 ? '+' : ''}{borrowingAdvantage.toFixed(2)}% Advantage
                </Badge>
              </div>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Avg. Interest Rate</div>
                <div className="text-2xl font-bold">{selectedSectorData.averageInterestRate}%</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Risk Profile</div>
                <div className={`text-lg font-semibold capitalize ${getRiskColor(selectedSectorData.riskProfile)}`}>
                  {selectedSectorData.riskProfile}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Growth Outlook</div>
                <div className={`text-lg font-semibold capitalize ${getGrowthColor(selectedSectorData.growthOutlook)}`}>
                  {selectedSectorData.growthOutlook}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Inflation Sensitivity</div>
                <div className={`text-lg font-semibold capitalize ${getRiskColor(selectedSectorData.inflationSensitivity)}`}>
                  {selectedSectorData.inflationSensitivity}
                </div>
              </Card>
            </div>

            {/* Recommendations & Loan Types */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Strategic Recommendations</h4>
                <ul className="space-y-2">
                  {selectedSectorData.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <TrendingUp className="h-3 w-3 mt-1 text-beneficial flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Common Loan Types</h4>
                <div className="space-y-2">
                  {selectedSectorData.commonLoanTypes.map((type, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {type}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Typical terms: {selectedSectorData.typicalLoanTerms.join(', ')} years
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Market Conditions Chart */}
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Market Conditions</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketConditionsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
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
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {marketConditionsData.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between">
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
              </Card>

              {/* Borrowing Timeline */}
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Optimal Borrowing Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">Immediate (0-3 months)</div>
                      <div className="text-sm text-muted-foreground">
                        {borrowingAdvantage > 0 ? 'Favorable conditions' : 'Consider waiting'}
                      </div>
                    </div>
                    <Badge variant={borrowingAdvantage > 0 ? "default" : "secondary"}>
                      {borrowingAdvantage > 0 ? 'Recommended' : 'Caution'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">Near-term (3-12 months)</div>
                      <div className="text-sm text-muted-foreground">
                        Monitor rate trends and sector performance
                      </div>
                    </div>
                    <Badge variant="outline">Monitor</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">Long-term (1+ years)</div>
                      <div className="text-sm text-muted-foreground">
                        Strategic positioning based on sector outlook
                      </div>
                    </div>
                    <Badge variant="outline">Strategic</Badge>
                  </div>
                </div>
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