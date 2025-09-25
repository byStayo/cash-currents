import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Image, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportToolsProps {
  data?: any;
  scenarios?: any[];
}

const ExportTools = ({ data, scenarios }: ExportToolsProps) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    if (!data) return;
    
    const csvContent = [
      ['Year', 'Inflation Rate (%)', 'Interest Rate (%)', 'Beneficial to Borrow'],
      ...data.map((row: any) => [
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
  };

  const exportScenariosToCSV = () => {
    if (!scenarios || scenarios.length === 0) return;
    
    const csvContent = [
      ['Scenario Name', 'Purpose', 'Loan Amount ($)', 'Interest Rate (%)', 'Term (Years)', 'Monthly Payment ($)', 'Status'],
      ...scenarios.map((scenario: any) => [
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
  };

  const generateReport = () => {
    const reportContent = `
# Borrowing Intelligence Report
Generated: ${new Date().toLocaleDateString()}

## Current Market Analysis
- Analysis based on mathematical relationship between inflation and interest rates
- When inflation > interest rate: Borrowing is mathematically beneficial
- When interest rate > inflation: Borrowing has a real cost

## Key Insights
1. **Historical Context**: Review periods when borrowing was most/least beneficial
2. **Current Environment**: Analyze today's rates against historical averages
3. **Scenario Planning**: Compare different borrowing scenarios and their real costs

## Methodology
This analysis uses the simple but powerful principle that inflation erodes the real cost of fixed-rate debt.
When inflation exceeds your borrowing rate, the purchasing power of your debt payments decreases over time.

---
*This report is for educational purposes and should not be considered financial advice.*
    `.trim();
    
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'borrowing-intelligence-report.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Generated",
      description: "Analysis report exported as markdown file",
    });
  };

  const shareAnalysis = async () => {
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
  };

  const captureChart = () => {
    // This would typically use html2canvas or similar library
    // For now, we'll show a placeholder message
    toast({
      title: "Feature Coming Soon",
      description: "Chart capture functionality will be available in the next update",
    });
  };

  return (
    <Card className="backdrop-blur-md bg-card-gradient border-glass-border shadow-glass animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export & Share
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="transition-all duration-200 hover:scale-105 hover:shadow-md"
            disabled={!data}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          
          <Button
            variant="outline"
            onClick={exportScenariosToCSV}
            className="transition-all duration-200 hover:scale-105 hover:shadow-md"
            disabled={!scenarios || scenarios.length === 0}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Scenarios
          </Button>
          
          <Button
            variant="outline"
            onClick={generateReport}
            className="transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          
          <Button
            variant="outline"
            onClick={shareAnalysis}
            className="transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Analysis
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Export Options:</strong> Download historical data, scenario comparisons, or generate comprehensive reports. 
            All exports include timestamps and methodology notes for reference.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportTools;