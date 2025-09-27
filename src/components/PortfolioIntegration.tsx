import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, Plus, Target } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  value: number;
  category: 'cash' | 'stocks' | 'bonds' | 'real-estate' | 'crypto' | 'other';
  growthRate: number; // Annual expected growth rate
}

interface LoanImpact {
  loanAmount: number;
  interestRate: number;
  termYears: number;
  monthlyPayment: number;
}

interface PortfolioIntegrationProps {
  currentInflation: number;
  loanImpact?: LoanImpact;
}

const PortfolioIntegration = ({ currentInflation, loanImpact }: PortfolioIntegrationProps) => {
  const [assets, setAssets] = useState<Asset[]>([
    { id: "1", name: "Emergency Fund", value: 50000, category: "cash", growthRate: 0.5 },
    { id: "2", name: "Investment Portfolio", value: 200000, category: "stocks", growthRate: 7.0 },
    { id: "3", name: "Primary Residence", value: 400000, category: "real-estate", growthRate: 3.5 },
    { id: "4", name: "Retirement 401k", value: 150000, category: "stocks", growthRate: 6.5 }
  ]);

  const [newAsset, setNewAsset] = useState({
    name: "",
    value: 0,
    category: "stocks" as Asset['category'],
    growthRate: 7.0
  });

  const categoryColors = {
    cash: "hsl(var(--chart-secondary))",
    stocks: "hsl(var(--chart-primary))",
    bonds: "hsl(var(--chart-tertiary))",
    "real-estate": "hsl(var(--chart-accent))",
    crypto: "hsl(var(--warning))",
    other: "hsl(var(--muted))"
  };

  const categoryLabels = {
    cash: "Cash & Savings",
    stocks: "Stocks & Funds",
    bonds: "Bonds & Fixed Income",
    "real-estate": "Real Estate",
    crypto: "Cryptocurrency",
    other: "Other Assets"
  };

  const totalAssets = useMemo(() => {
    return assets.reduce((sum, asset) => sum + asset.value, 0);
  }, [assets]);

  const netWorth = useMemo(() => {
    const totalDebt = loanImpact ? loanImpact.loanAmount : 0;
    return totalAssets - totalDebt;
  }, [totalAssets, loanImpact]);

  const assetAllocation = useMemo(() => {
    const allocation: { [key: string]: number } = {};
    assets.forEach(asset => {
      allocation[asset.category] = (allocation[asset.category] || 0) + asset.value;
    });

    return Object.entries(allocation).map(([category, value]) => ({
      name: categoryLabels[category as Asset['category']],
      value,
      percentage: (value / totalAssets) * 100,
      color: categoryColors[category as Asset['category']]
    }));
  }, [assets, totalAssets]);

  const projectedGrowth = useMemo(() => {
    const years = Array.from({ length: 10 }, (_, i) => i + 1);
    
    return years.map(year => {
      const assetsGrowth = assets.reduce((sum, asset) => {
        const realGrowthRate = asset.growthRate - currentInflation;
        return sum + asset.value * Math.pow(1 + realGrowthRate / 100, year);
      }, 0);

      const debtReduction = loanImpact 
        ? loanImpact.loanAmount - (loanImpact.monthlyPayment * 12 * year - 
          (loanImpact.loanAmount * (loanImpact.interestRate / 100) * year))
        : 0;

      return {
        year: new Date().getFullYear() + year,
        assets: assetsGrowth,
        debt: Math.max(0, debtReduction),
        netWorth: assetsGrowth - Math.max(0, debtReduction)
      };
    });
  }, [assets, currentInflation, loanImpact]);

  const addAsset = () => {
    if (newAsset.name && newAsset.value > 0) {
      setAssets([...assets, { ...newAsset, id: Date.now().toString() }]);
      setNewAsset({ name: "", value: 0, category: "stocks", growthRate: 7.0 });
    }
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  const loanToAssetRatio = loanImpact ? (loanImpact.loanAmount / totalAssets) * 100 : 0;
  const debtServiceRatio = loanImpact ? (loanImpact.monthlyPayment * 12 / totalAssets) * 100 : 0;

  return (
    <Card className="backdrop-blur-md bg-card-gradient border-glass-border shadow-glass animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Portfolio Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
            <TabsTrigger value="assets">Manage Assets</TabsTrigger>
            <TabsTrigger value="projections">Future Projections</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-muted/30 border-muted">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Assets</p>
                      <p className="text-xl font-bold">${totalAssets.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30 border-muted">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-beneficial" />
                    <div>
                      <p className="text-sm text-muted-foreground">Net Worth</p>
                      <p className="text-xl font-bold">${netWorth.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {loanImpact && (
                <>
                  <Card className="bg-muted/30 border-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-risk" />
                        <div>
                          <p className="text-sm text-muted-foreground">Loan-to-Asset</p>
                          <p className="text-xl font-bold">{loanToAssetRatio.toFixed(1)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30 border-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-warning" />
                        <div>
                          <p className="text-sm text-muted-foreground">Debt Service</p>
                          <p className="text-xl font-bold">{debtServiceRatio.toFixed(1)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Asset Allocation Pie Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-muted/30 border-muted">
                <CardHeader>
                  <CardTitle className="text-lg">Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetAllocation}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                        >
                          {assetAllocation.map((entry, index) => (
                            <Cell key={`portfolio-cell-${entry.name}-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30 border-muted">
                <CardHeader>
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Liquidity Risk</span>
                      <span className="text-sm font-medium">
                        {((assets.find(a => a.category === 'cash')?.value || 0) / totalAssets * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(assets.find(a => a.category === 'cash')?.value || 0) / totalAssets * 100} 
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Equity Exposure</span>
                      <span className="text-sm font-medium">
                        {((assets.filter(a => a.category === 'stocks').reduce((sum, a) => sum + a.value, 0)) / totalAssets * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(assets.filter(a => a.category === 'stocks').reduce((sum, a) => sum + a.value, 0)) / totalAssets * 100} 
                      className="h-2"
                    />
                  </div>

                  {loanImpact && (
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Leverage Ratio</span>
                        <span className="text-sm font-medium">{loanToAssetRatio.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={Math.min(loanToAssetRatio, 100)} 
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            {/* Add New Asset */}
            <Card className="bg-muted/30 border-muted">
              <CardHeader>
                <CardTitle className="text-lg">Add New Asset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Asset Name</Label>
                    <Input
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                      placeholder="e.g., Savings Account"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Current Value ($)</Label>
                    <Input
                      type="number"
                      value={newAsset.value || ""}
                      onChange={(e) => setNewAsset({...newAsset, value: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={newAsset.category}
                      onChange={(e) => setNewAsset({...newAsset, category: e.target.value as Asset['category']})}
                    >
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Expected Growth Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newAsset.growthRate || ""}
                      onChange={(e) => setNewAsset({...newAsset, growthRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <Button onClick={addAsset} className="w-full" disabled={!newAsset.name || newAsset.value <= 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              </CardContent>
            </Card>

            {/* Current Assets */}
            <div className="space-y-4">
              {assets.map((asset) => (
                <Card key={asset.id} className="bg-muted/30 border-muted">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{asset.name}</h3>
                        <p className="text-sm text-muted-foreground">{categoryLabels[asset.category]}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold text-lg">${asset.value.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{asset.growthRate}% growth</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeAsset(asset.id)}
                        className="text-risk hover:bg-risk/10"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <Card className="bg-muted/30 border-muted">
              <CardHeader>
                <CardTitle className="text-lg">10-Year Portfolio Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectedGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                      <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `$${value.toLocaleString()}`, 
                          name === 'assets' ? 'Total Assets' : name === 'debt' ? 'Remaining Debt' : 'Net Worth'
                        ]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="assets"
                        stroke="hsl(var(--chart-primary))"
                        strokeWidth={2}
                        name="Total Assets"
                      />
                      {loanImpact && (
                        <Line
                          type="monotone"
                          dataKey="debt"
                          stroke="hsl(var(--chart-tertiary))"
                          strokeWidth={2}
                          name="Remaining Debt"
                        />
                      )}
                      <Line
                        type="monotone"
                        dataKey="netWorth"
                        stroke="hsl(var(--chart-secondary))"
                        strokeWidth={3}
                        name="Net Worth"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card className="bg-muted/30 border-muted">
              <CardHeader>
                <CardTitle className="text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-beneficial">Portfolio Strengths</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Diversified across {Object.keys(assetAllocation).length} asset classes</li>
                      <li>• {((assets.find(a => a.category === 'cash')?.value || 0) / totalAssets * 100).toFixed(1)}% liquidity buffer</li>
                      <li>• Expected real growth: {(assets.reduce((sum, a) => sum + (a.value * a.growthRate), 0) / totalAssets - currentInflation).toFixed(1)}%</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-warning">Areas to Consider</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {loanToAssetRatio > 50 && <li>• High leverage ratio ({loanToAssetRatio.toFixed(1)}%)</li>}
                      {debtServiceRatio > 15 && <li>• Significant debt service burden ({debtServiceRatio.toFixed(1)}%)</li>}
                      {(assets.find(a => a.category === 'cash')?.value || 0) / totalAssets < 0.1 && <li>• Low emergency fund ratio</li>}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PortfolioIntegration;