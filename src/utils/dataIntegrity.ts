// Data integrity validation for financial calculations
export const validateFinancialData = (data: {
  inflation: number;
  interestRate: number;
  loanAmount?: number;
  creditScore?: number;
}) => {
  const errors: string[] = [];
  
  // Validate inflation rate
  if (typeof data.inflation !== 'number' || isNaN(data.inflation)) {
    errors.push('Invalid inflation rate');
  } else if (data.inflation < -10 || data.inflation > 50) {
    errors.push('Inflation rate out of realistic range (-10% to 50%)');
  }
  
  // Validate interest rate
  if (typeof data.interestRate !== 'number' || isNaN(data.interestRate)) {
    errors.push('Invalid interest rate');
  } else if (data.interestRate < 0 || data.interestRate > 50) {
    errors.push('Interest rate out of realistic range (0% to 50%)');
  }
  
  // Validate loan amount if provided
  if (data.loanAmount !== undefined) {
    if (typeof data.loanAmount !== 'number' || isNaN(data.loanAmount)) {
      errors.push('Invalid loan amount');
    } else if (data.loanAmount < 0) {
      errors.push('Loan amount cannot be negative');
    } else if (data.loanAmount > 10000000) {
      errors.push('Loan amount exceeds maximum ($10M)');
    }
  }
  
  // Validate credit score if provided
  if (data.creditScore !== undefined) {
    if (typeof data.creditScore !== 'number' || isNaN(data.creditScore)) {
      errors.push('Invalid credit score');
    } else if (data.creditScore < 300 || data.creditScore > 850) {
      errors.push('Credit score out of valid range (300-850)');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Calculate compound interest with proper error handling
export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  periods: number,
  compoundingFrequency: number = 12
): number => {
  if (principal <= 0 || rate < 0 || periods <= 0) {
    throw new Error('Invalid parameters for compound interest calculation');
  }
  
  const periodicRate = rate / (100 * compoundingFrequency);
  const totalPeriods = periods * compoundingFrequency;
  
  return principal * Math.pow(1 + periodicRate, totalPeriods);
};

// Calculate real interest rate (Fisher equation)
export const calculateRealRate = (nominalRate: number, inflationRate: number): number => {
  return ((1 + nominalRate / 100) / (1 + inflationRate / 100) - 1) * 100;
};

// Calculate monthly payment for a loan
export const calculateMonthlyPayment = (
  loanAmount: number,
  annualRate: number,
  years: number
): number => {
  if (loanAmount <= 0 || annualRate < 0 || years <= 0) {
    throw new Error('Invalid loan parameters');
  }
  
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = years * 12;
  
  if (monthlyRate === 0) {
    return loanAmount / totalPayments;
  }
  
  return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
         (Math.pow(1 + monthlyRate, totalPayments) - 1);
};