import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { TrendingUp, Home, Coins, BarChart3 } from "lucide-react";

// Generate realistic asset price data
const generateAssetData = () => {
  const data = [];
  const startYear = 1970;
  const endYear = 2024;
  
  let realEstateBase = 50000;
  let sp500Base = 100;
  let goldBase = 35;
  
  for (let year = startYear; year <= endYear; year++) {
    // Simulate realistic price movements
    const realEstateGrowth = 1 + (0.05 + Math.sin((year - 1970) * 0.1) * 0.03 + Math.random() * 0.04);
    const sp500Growth = 1 + (0.08 + Math.sin((year - 1970) * 0.15) * 0.1 + Math.random() * 0.15);
    const goldGrowth = 1 + (0.03 + Math.sin((year - 1970) * 0.2) * 0.08 + Math.random() * 0.1);
    
    realEstateBase *= realEstateGrowth;
    sp500Base *= sp500Growth;
    goldBase *= goldGrowth;
    
    // Calculate inflation for this year (simplified)
    const inflationRate = 2 + Math.sin((year - 1970) * 0.15) * 3 + Math.random() * 2;
    const cumulativeInflation = Math.pow(1 + inflationRate/100, year - 1970);
    
    data.push({
      year,
      realEstate: realEstateBase,
      sp500: sp500Base,
      gold: goldBase,
      realEstateInflationAdjusted: realEstateBase / cumulativeInflation,
      sp500InflationAdjusted: sp500Base / cumulativeInflation,
      goldInflationAdjusted: goldBase / cumulativeInflation,
      inflation: inflationRate,
    });
  }
  
  return data;
};

interface AssetOverlayProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const AssetOverlay = ({ selectedYear, onYearChange }: AssetOverlayProps) => {
  const [showInflationAdjusted, setShowInflationAdjusted] = useState(false);
  const [activeAssets, setActiveAssets] = useState({
    realEstate: true,
    sp500: true,
    gold: false,
  });

  const assetData = useMemo(() => generateAssetData(), []);
  
  const currentYearData = assetData.find(d => d.year === selectedYear);
  
  const toggleAsset = (asset: keyof typeof activeAssets) => {
    setActiveAssets(prev => ({ ...prev, [asset]: !prev[asset] }));
  };

  const formatPrice = (value: number, asset: string) => {
    if (asset === 'sp500') return `$${value.toFixed(0)}`;
    if (asset === 'gold') return `$${value.toFixed(0)}/oz`;
    return `$${(value / 1000).toFixed(0)}k`;
  };

  const getAssetIcon = (asset: string) => {
    switch (asset) {
      case 'realEstate': return <Home className="h-4 w-4" />;
      case 'sp500': return <TrendingUp className="h-4 w-4" />;
      case 'gold': return <Coins className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getAssetLabel = (asset: string) => {
    switch (asset) {
      case 'realEstate': return 'Real Estate';
      case 'sp500': return 'S&P 500';
      case 'gold': return 'Gold';
      default: return asset;
    }
  };

  return (
    <Card className="backdrop-blur-md bg-card-gradient border-glass-border shadow-glass animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Asset Price Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Switch 
              id="inflation-adjusted" 
              checked={showInflationAdjusted}
              onCheckedChange={setShowInflationAdjusted}
            />
            <Label htmlFor="inflation-adjusted" className="text-sm font-medium">
              Show Inflation-Adjusted Prices
            </Label>
          </div>
          
          <div className="flex gap-2">
            {Object.entries(activeAssets).map(([asset, active]) => (
              <Button
                key={asset}
                variant={active ? "default" : "outline"}
                size="sm"
                onClick={() => toggleAsset(asset as keyof typeof activeAssets)}
                className="transition-all duration-200 hover:scale-105"
              >
                {getAssetIcon(asset)}
                <span className="ml-1">{getAssetLabel(asset)}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Current Year Asset Prices */}
        {currentYearData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(activeAssets)
              .filter(([_, active]) => active)
              .map(([asset, _]) => {
                const currentPrice = showInflationAdjusted 
                  ? currentYearData[`${asset}InflationAdjusted` as keyof typeof currentYearData] as number
                  : currentYearData[asset as keyof typeof currentYearData] as number;
                
                const previousYearData = assetData.find(d => d.year === selectedYear - 1);
                const previousPrice = previousYearData 
                  ? (showInflationAdjusted 
                      ? previousYearData[`${asset}InflationAdjusted` as keyof typeof previousYearData] as number
                      : previousYearData[asset as keyof typeof previousYearData] as number)
                  : currentPrice;
                
                const change = ((currentPrice - previousPrice) / previousPrice) * 100;
                
                return (
                  <Card key={asset} className="bg-glass border-glass-border animate-scale-in hover:animate-float">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getAssetIcon(asset)}
                          <span className="font-medium">{getAssetLabel(asset)}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {formatPrice(currentPrice, asset)}
                          </p>
                          <p className={`text-sm ${change >= 0 ? 'text-beneficial' : 'text-risk'}`}>
                            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      {showInflationAdjusted && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Inflation-adjusted to {selectedYear} dollars
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}

        {/* Asset Price Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={assetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
              <XAxis 
                dataKey="year" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                scale="log"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold mb-2">{label}</p>
                        {payload.map((item, index) => (
                          <p key={index} className="text-sm" style={{ color: item.color }}>
                            {item.name}: {formatPrice(item.value as number, item.dataKey as string)}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              
              {activeAssets.realEstate && (
                <Line
                  type="monotone"
                  dataKey={showInflationAdjusted ? "realEstateInflationAdjusted" : "realEstate"}
                  stroke="hsl(var(--chart-tertiary))"
                  strokeWidth={2}
                  dot={false}
                  name="Real Estate"
                />
              )}
              
              {activeAssets.sp500 && (
                <Line
                  type="monotone"
                  dataKey={showInflationAdjusted ? "sp500InflationAdjusted" : "sp500"}
                  stroke="hsl(var(--chart-primary))"
                  strokeWidth={2}
                  dot={false}
                  name="S&P 500"
                />
              )}
              
              {activeAssets.gold && (
                <Line
                  type="monotone"
                  dataKey={showInflationAdjusted ? "goldInflationAdjusted" : "gold"}
                  stroke="hsl(var(--chart-accent))"
                  strokeWidth={2}
                  dot={false}
                  name="Gold"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Insights */}
        <Card className="bg-muted/20 border-muted">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Asset Performance Insights</h3>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>• {showInflationAdjusted ? 'Inflation-adjusted' : 'Nominal'} prices show {showInflationAdjusted ? 'real purchasing power' : 'raw price movements'}</p>
              <p>• Real estate typically provides steady appreciation with inflation hedge properties</p>
              <p>• S&P 500 offers higher volatility with potential for greater long-term returns</p>
              <p>• Gold traditionally serves as an inflation hedge but with significant volatility</p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default AssetOverlay;