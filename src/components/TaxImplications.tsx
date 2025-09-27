import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calculator, FileText, DollarSign, Percent, TrendingUp, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid, ComposedChart } from 'recharts';

interface TaxImplicationsProps {
  currentInflation?: number;
  currentInterest?: number;
}

export const TaxImplications: React.FC<TaxImplicationsProps> = ({
  currentInflation = 3.2,
  currentInterest = 7.5
}) => {
  const [annualIncome, setAnnualIncome] = useState([75000]);
  const [filingStatus, setFilingStatus] = useState('single');
  const [loanAmount, setLoanAmount] = useState([300000]);
  const [loanType, setLoanType] = useState('mortgage');
  const [state, setState] = useState('california');
  const [marriageYear, setMarriageYear] = useState([2024]);
  const [propertyType, setPropertyType] = useState('primary');
  const [loanPurpose, setLoanPurpose] = useState('purchase');

  // Enhanced state tax data
  const stateData = useMemo(() => ({
    'california': { rate: 9.3, saltCap: true, name: 'California' },
    'new-york': { rate: 8.82, saltCap: true, name: 'New York' },
    'texas': { rate: 0, saltCap: false, name: 'Texas' },
    'florida': { rate: 0, saltCap: false, name: 'Florida' },
    'illinois': { rate: 4.95, saltCap: true, name: 'Illinois' },
    'pennsylvania': { rate: 3.07, saltCap: true, name: 'Pennsylvania' },
    'ohio': { rate: 3.99, saltCap: true, name: 'Ohio' },
    'georgia': { rate: 5.75, saltCap: true, name: 'Georgia' },
    'north-carolina': { rate: 4.99, saltCap: true, name: 'North Carolina' },
    'michigan': { rate: 4.25, saltCap: true, name: 'Michigan' }
  }), []);

  const getTaxBracket = (income: number, status: string) => {
    // 2024 Federal Tax Brackets - Updated for accuracy
    const brackets = {
      single: [
        { min: 0, max: 11000, rate: 10 },
        { min: 11000, max: 44725, rate: 12 },
        { min: 44725, max: 95375, rate: 22 },
        { min: 95375, max: 182050, rate: 24 },
        { min: 182050, max: 231250, rate: 32 },
        { min: 231250, max: 578125, rate: 35 },
        { min: 578125, max: Infinity, rate: 37 }
      ],
      married: [
        { min: 0, max: 22000, rate: 10 },
        { min: 22000, max: 89450, rate: 12 },
        { min: 89450, max: 190750, rate: 22 },
        { min: 190750, max: 364200, rate: 24 },
        { min: 364200, max: 462500, rate: 32 },
        { min: 462500, max: 693750, rate: 35 },
        { min: 693750, max: Infinity, rate: 37 }
      ]
    };

    const relevantBrackets = brackets[status as keyof typeof brackets] || brackets.single;
    for (const bracket of relevantBrackets) {
      if (income >= bracket.min && income < bracket.max) {
        return bracket.rate;
      }
    }
    return 37; // Top bracket
  };

  const calculateStandardDeduction = (status: string, year: number = 2024) => {
    const deductions = {
      2024: { single: 14600, married: 29200 },
      2023: { single: 13850, married: 27700 }
    };
    return deductions[year as keyof typeof deductions]?.[status as keyof typeof deductions[2024]] || deductions[2024][status as keyof typeof deductions[2024]];
  };

  const calculateTaxSavings = () => {
    const taxBracket = getTaxBracket(annualIncome[0], filingStatus);
    const annualInterest = (loanAmount[0] * currentInterest) / 100;
    const standardDeduction = calculateStandardDeduction(filingStatus);
    const currentStateData = stateData[state as keyof typeof stateData] || { rate: 0, saltCap: false, name: 'Federal Only' };
    
    let deductibleInterest = 0;
    let additionalInfo = '';
    
    switch (loanType) {
      case 'mortgage':
        // Enhanced mortgage calculation considering property type
        const mortgageCap = propertyType === 'primary' ? 750000 : 
                           propertyType === 'second-home' ? 750000 : 0; // Investment properties not deductible
        const cappedLoanAmount = Math.min(loanAmount[0], mortgageCap);
        deductibleInterest = propertyType === 'investment' ? 0 : (cappedLoanAmount * currentInterest) / 100;
        
        if (propertyType === 'investment') {
          additionalInfo = 'Investment property interest may be deductible against rental income';
        } else if (loanAmount[0] > mortgageCap) {
          additionalInfo = `Interest capped at $${mortgageCap.toLocaleString()} loan limit`;
        }
        break;
        
      case 'business':
        // Business loans are generally fully deductible
        deductibleInterest = annualInterest;
        additionalInfo = 'Business interest fully deductible against business income';
        break;
        
      case 'investment':
        // Investment interest deduction with enhanced calculation
        const netInvestmentIncome = Math.max(0, annualIncome[0] * 0.08 - 3000); // More realistic estimate
        deductibleInterest = Math.min(annualInterest, netInvestmentIncome);
        additionalInfo = 'Limited to net investment income; excess carries forward';
        break;
        
      case 'student':
        // Enhanced student loan calculation
        const maxStudentDeduction = 2500;
        const phaseOutStart = filingStatus === 'married' ? 145000 : 70000;
        const phaseOutEnd = filingStatus === 'married' ? 175000 : 85000;
        
        if (annualIncome[0] >= phaseOutEnd) {
          deductibleInterest = 0;
          additionalInfo = 'Income too high for student loan deduction';
        } else if (annualIncome[0] >= phaseOutStart) {
          const phaseOutRatio = (phaseOutEnd - annualIncome[0]) / (phaseOutEnd - phaseOutStart);
          deductibleInterest = Math.min(annualInterest, maxStudentDeduction * phaseOutRatio);
          additionalInfo = 'Deduction phased out due to income level';
        } else {
          deductibleInterest = Math.min(annualInterest, maxStudentDeduction);
          additionalInfo = 'Full deduction available up to $2,500';
        }
        break;
        
      case 'heloc':
        // HELOC rules - only deductible if used for home improvement
        const helocCap = 100000;
        const cappedHeloc = Math.min(loanAmount[0], helocCap);
        deductibleInterest = loanPurpose === 'home-improvement' ? (cappedHeloc * currentInterest) / 100 : 0;
        additionalInfo = loanPurpose === 'home-improvement' ? 
          'Deductible when used for home improvements' : 
          'Not deductible for personal use';
        break;
        
      default:
        deductibleInterest = 0;
        additionalInfo = 'Personal loans and credit cards are not tax-deductible';
    }

    // Enhanced tax calculations
    const federalTaxSavings = (deductibleInterest * taxBracket) / 100;
    
    // State tax calculation with SALT cap consideration
    let stateTaxSavings = 0;
    if (currentStateData.rate > 0) {
      const baseStateSavings = (deductibleInterest * currentStateData.rate) / 100;
      // SALT cap of $10,000 may limit total state/local deductions
      if (currentStateData.saltCap && annualIncome[0] > 100000) {
        stateTaxSavings = Math.min(baseStateSavings, 1000); // Simplified SALT impact
        if (baseStateSavings > 1000) {
          additionalInfo += ' (Limited by SALT cap)';
        }
      } else {
        stateTaxSavings = baseStateSavings;
      }
    }
    
    const totalTaxSavings = federalTaxSavings + stateTaxSavings;
    const effectiveRate = ((annualInterest - totalTaxSavings) / loanAmount[0]) * 100;
    const inflationAdjustedRate = effectiveRate - currentInflation;
    
    // Calculate break-even analysis
    const monthlyTaxSavings = totalTaxSavings / 12;
    const breakEvenYears = totalTaxSavings > 0 ? loanAmount[0] / (totalTaxSavings * 12) : Infinity;

    return {
      annualInterest,
      deductibleInterest,
      federalTaxSavings,
      stateTaxSavings,
      totalTaxSavings,
      effectiveRate,
      inflationAdjustedRate,
      taxBracket,
      monthlyTaxSavings,
      breakEvenYears,
      additionalInfo,
      standardDeduction,
      currentState: currentStateData
    };
  };

  const taxData = calculateTaxSavings();

  // Enhanced visualization data
  const pieData = [
    { name: 'After-Tax Interest', value: taxData.annualInterest - taxData.totalTaxSavings, fill: 'hsl(var(--risk))' },
    { name: 'Federal Tax Savings', value: taxData.federalTaxSavings, fill: 'hsl(var(--beneficial))' },
    { name: 'State Tax Savings', value: taxData.stateTaxSavings, fill: 'hsl(var(--primary))' }
  ].filter(item => item.value > 0);

  const comparisonData = [
    {
      name: 'Nominal Rate',
      rate: currentInterest,
      cost: taxData.annualInterest,
      category: 'gross'
    },
    {
      name: 'After-Tax Rate',
      rate: taxData.effectiveRate,
      cost: taxData.annualInterest - taxData.totalTaxSavings,
      category: 'net'
    },
    {
      name: 'Real Rate',
      rate: taxData.inflationAdjustedRate,
      cost: (taxData.annualInterest - taxData.totalTaxSavings) - (loanAmount[0] * currentInflation / 100),
      category: 'real'
    }
  ];

  // Multi-year projection
  const projectionData = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const year = i + 1;
      const cumulativeInterest = taxData.annualInterest * year;
      const cumulativeTaxSavings = taxData.totalTaxSavings * year;
      const inflationImpact = loanAmount[0] * Math.pow(1 + currentInflation / 100, year) - loanAmount[0];
      
      return {
        year,
        grossCost: cumulativeInterest,
        netCost: cumulativeInterest - cumulativeTaxSavings,
        realCost: (cumulativeInterest - cumulativeTaxSavings) - inflationImpact,
        taxSavings: cumulativeTaxSavings
      };
    });
  }, [taxData, loanAmount, currentInflation]);

  return (
    <Card className="w-full glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Advanced Tax Implications Analysis
        </CardTitle>
        <CardDescription>
          Comprehensive tax benefits analysis with state-specific calculations and multi-year projections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="calculator" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="projections">Multi-Year View</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Financial Details
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="annual-income">Annual Income: ${annualIncome[0].toLocaleString()}</Label>
                      <Slider
                        id="annual-income"
                        min={30000}
                        max={500000}
                        step={5000}
                        value={annualIncome}
                        onValueChange={setAnnualIncome}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="filing-status">Filing Status</Label>
                      <Select value={filingStatus} onValueChange={setFilingStatus}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married Filing Jointly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="loan-amount-tax">Loan Amount: ${loanAmount[0].toLocaleString()}</Label>
                      <Slider
                        id="loan-amount-tax"
                        min={10000}
                        max={1000000}
                        step={10000}
                        value={loanAmount}
                        onValueChange={setLoanAmount}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Loan Details
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="loan-type">Loan Type</Label>
                      <Select value={loanType} onValueChange={setLoanType}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mortgage">Primary Mortgage</SelectItem>
                          <SelectItem value="heloc">HELOC</SelectItem>
                          <SelectItem value="business">Business Loan</SelectItem>
                          <SelectItem value="investment">Investment Loan</SelectItem>
                          <SelectItem value="student">Student Loan</SelectItem>
                          <SelectItem value="personal">Personal Loan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {loanType === 'mortgage' && (
                      <div>
                        <Label htmlFor="property-type">Property Type</Label>
                        <Select value={propertyType} onValueChange={setPropertyType}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">Primary Residence</SelectItem>
                            <SelectItem value="second-home">Second Home</SelectItem>
                            <SelectItem value="investment">Investment Property</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {loanType === 'heloc' && (
                      <div>
                        <Label htmlFor="loan-purpose">HELOC Purpose</Label>
                        <Select value={loanPurpose} onValueChange={setLoanPurpose}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home-improvement">Home Improvement</SelectItem>
                            <SelectItem value="personal">Personal Use</SelectItem>
                            <SelectItem value="investment">Investment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location & Tax Jurisdiction
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="state-tax">State</Label>
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(stateData).map(([key, data]) => (
                            <SelectItem key={key} value={key}>
                              {data.name} ({data.rate}% state tax)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-beneficial">
                        ${taxData.totalTaxSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-sm text-muted-foreground">Annual Tax Savings</div>
                      <Badge variant="outline" className="mt-2">
                        ${taxData.monthlyTaxSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/month
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Federal Tax Bracket</span>
                        <Badge variant="outline">{taxData.taxBracket}%</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">State Tax Rate</span>
                        <Badge variant="outline">{taxData.currentState.rate}%</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Federal Savings</span>
                        <span className="font-medium">${taxData.federalTaxSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                      </div>
                      
                      {taxData.stateTaxSavings > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm">State Savings</span>
                          <span className="font-medium">${taxData.stateTaxSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm font-medium">Effective Rate</span>
                        <span className="font-bold text-primary">{taxData.effectiveRate.toFixed(2)}%</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Real Rate</span>
                        <span className={`font-bold ${taxData.inflationAdjustedRate < 0 ? 'text-beneficial' : 'text-warning'}`}>
                          {taxData.inflationAdjustedRate.toFixed(2)}%
                        </span>
                      </div>

                      {taxData.breakEvenYears < 50 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Break-even</span>
                          <span className="font-bold text-muted-foreground">
                            {taxData.breakEvenYears.toFixed(1)} years
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {taxData.additionalInfo && (
                  <Card className="bg-muted/50 border-warning/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Important Notice</h4>
                          <p className="text-xs text-muted-foreground">{taxData.additionalInfo}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-accent/30">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Tax Benefit Summary
                    </h4>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Deductible Interest:</span>
                        <span className="font-medium">${taxData.deductibleInterest.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax Savings Rate:</span>
                        <span className="font-medium">{((taxData.totalTaxSavings / taxData.deductibleInterest) * 100 || 0).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Standard Deduction:</span>
                        <span className="font-medium">${taxData.standardDeduction.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-4">Interest Cost Breakdown</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`tax-cell-${entry.name}-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-4">Rate Impact Analysis</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer>
                        <BarChart data={comparisonData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                          <XAxis dataKey="name" fontSize={10} />
                          <YAxis fontSize={12} />
                          <Tooltip 
                            formatter={(value: number, name: string) => [
                              `${value.toFixed(2)}%`, 
                              name === 'rate' ? 'Interest Rate' : 'Annual Cost'
                            ]}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))'
                            }}
                          />
                          <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tax Efficiency Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tax Savings Rate</span>
                        <span>{((taxData.totalTaxSavings / taxData.annualInterest) * 100 || 0).toFixed(1)}%</span>
                      </div>
                      <Progress value={(taxData.totalTaxSavings / taxData.annualInterest) * 100 || 0} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Interest Deductibility</span>
                        <span>{((taxData.deductibleInterest / taxData.annualInterest) * 100 || 0).toFixed(1)}%</span>
                      </div>
                      <Progress value={(taxData.deductibleInterest / taxData.annualInterest) * 100 || 0} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Inflation Hedge</span>
                        <span className={taxData.inflationAdjustedRate < 0 ? 'text-beneficial' : 'text-warning'}>
                          {taxData.inflationAdjustedRate < 0 ? 'Positive' : 'Negative'}
                        </span>
                      </div>
                      <Progress 
                        value={Math.max(0, Math.min(100, 50 + (taxData.inflationAdjustedRate * -10)))} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Optimization Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {taxData.inflationAdjustedRate < 0 && (
                      <div className="flex items-start gap-2 p-3 bg-beneficial/10 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-beneficial mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-beneficial">Inflation Arbitrage</p>
                          <p className="text-xs text-muted-foreground">Your real borrowing cost is negative - consider maximizing this loan</p>
                        </div>
                      </div>
                    )}
                    
                    {taxData.taxBracket >= 24 && taxData.deductibleInterest < taxData.annualInterest && (
                      <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg">
                        <Calculator className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-primary">Tax Optimization</p>
                          <p className="text-xs text-muted-foreground">High tax bracket - consider restructuring to maximize deductions</p>
                        </div>
                      </div>
                    )}
                    
                    {loanType === 'personal' && loanAmount[0] > 50000 && (
                      <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-warning">Loan Restructuring</p>
                          <p className="text-xs text-muted-foreground">Consider secured loan options for better tax treatment</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  10-Year Tax Impact Projection
                </CardTitle>
                <CardDescription>
                  Cumulative costs and savings over time with inflation adjustment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <ComposedChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `$${Number(value).toLocaleString()}`, 
                          name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="grossCost" fill="hsl(var(--muted))" name="Gross Interest Cost" />
                      <Bar dataKey="netCost" fill="hsl(var(--primary))" name="After-Tax Cost" />
                      <Line type="monotone" dataKey="realCost" stroke="hsl(var(--warning))" name="Real Cost" strokeWidth={3} />
                      <Line type="monotone" dataKey="taxSavings" stroke="hsl(var(--beneficial))" name="Tax Savings" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};