import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
}

const ExportTools = memo(({ data, scenarios }: ExportToolsProps) => {
  const { toast } = useToast();

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

  const generateReport = useCallback(() => {
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
  }, [toast]);

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
          Export & Share
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="group" aria-label="Export options">
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="transition-all duration-200 hover:scale-105 hover:shadow-md"
            disabled={!data}
            aria-describedby="export-data-desc"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <span id="export-data-desc" className="sr-only">Export historical inflation and interest rate data to CSV</span>
          
          <Button
            variant="outline"
            onClick={exportScenariosToCSV}
            className="transition-all duration-200 hover:scale-105 hover:shadow-md"
            disabled={!scenarios || scenarios.length === 0}
            aria-describedby="export-scenarios-desc"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Scenarios
          </Button>
          <span id="export-scenarios-desc" className="sr-only">Export borrowing scenarios comparison to CSV</span>
          
          <Button
            variant="outline"
            onClick={generateReport}
            className="transition-all duration-200 hover:scale-105 hover:shadow-md"
            aria-describedby="generate-report-desc"
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <span id="generate-report-desc" className="sr-only">Generate comprehensive analysis report as markdown file</span>
          
          <Button
            variant="outline"
            onClick={shareAnalysis}
            className="transition-all duration-200 hover:scale-105 hover:shadow-md"
            aria-describedby="share-analysis-desc"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Analysis
          </Button>
          <span id="share-analysis-desc" className="sr-only">Share analysis link via native share or copy to clipboard</span>
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
});

ExportTools.displayName = 'ExportTools';

export default ExportTools;