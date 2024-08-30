// src/lib/utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


// Add the following tax calculation functions
const TAX_BANDS = {
  PERSONAL_ALLOWANCE: 12570,
  BASIC_RATE_LIMIT: 50270,
  HIGHER_RATE_LIMIT: 125140
};

const NIC_BANDS = {
  PRIMARY_THRESHOLD: 12570,
  UPPER_EARNINGS_LIMIT: 50270
};

const calculateIncomeTax = (income) => {
  let tax = 0;
  if (income > TAX_BANDS.HIGHER_RATE_LIMIT) {
    tax += (income - TAX_BANDS.HIGHER_RATE_LIMIT) * 0.45;
    income = TAX_BANDS.HIGHER_RATE_LIMIT;
  }
  if (income > TAX_BANDS.BASIC_RATE_LIMIT) {
    tax += (income - TAX_BANDS.BASIC_RATE_LIMIT) * 0.40;
    income = TAX_BANDS.BASIC_RATE_LIMIT;
  }
  if (income > TAX_BANDS.PERSONAL_ALLOWANCE) {
    tax += (income - TAX_BANDS.PERSONAL_ALLOWANCE) * 0.20;
  }
  return tax;
};

const calculateNIC = (income, rate = 0.12) => {
  let nic = 0;
  if (income > NIC_BANDS.UPPER_EARNINGS_LIMIT) {
    nic += (income - NIC_BANDS.UPPER_EARNINGS_LIMIT) * 0.02;
    income = NIC_BANDS.UPPER_EARNINGS_LIMIT;
  }
  if (income > NIC_BANDS.PRIMARY_THRESHOLD) {
    nic += (income - NIC_BANDS.PRIMARY_THRESHOLD) * rate;
  }
  return nic;
};

export const calculateNetChange = (userData, pmPolicies) => {
  const { annualIncome } = userData;
  const income = Number(annualIncome);
  const currentTax = calculateIncomeTax(income);
  const currentNIC = calculateNIC(income);

  return pmPolicies.map(pm => {
    let newTax = currentTax + pm.incomeTaxChange(income);
    let newNIC = currentNIC + pm.nationalInsuranceChange(income);
    
    const taxChange = currentTax - newTax;
    const nicChange = currentNIC - newNIC;
    const netChange = taxChange + nicChange;
    
    const detailedBreakdown = {
      "Current Income Tax": currentTax,
      "New Income Tax": newTax,
      "Current NIC": currentNIC,
      "New NIC": newNIC,
      "Tax Savings": taxChange,
      "NIC Savings": nicChange
    };

    return {
      ...pm,
      netChange: Math.round(netChange),
      detailedBreakdown,
      taxBenefits: pm.taxBenefits
    };
  });
};

// Remove or comment out the unused function
// function calculateTaxImpact({ income, capitalGains }) {
//   // Use the variables in your calculations or remove them if not needed
//   // ... rest of the function
// }