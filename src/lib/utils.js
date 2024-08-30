// src/lib/utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Add the following tax calculation functions

const taxBrackets = {
  basic: { threshold: 12570, rate: 0.2 },
  higher: { threshold: 50270, rate: 0.4 },
  additional: { threshold: 150000, rate: 0.45 }
};

const calculateIncomeTax = (income) => {
  let tax = 0;
  if (income > taxBrackets.additional.threshold) {
    tax += (income - taxBrackets.additional.threshold) * taxBrackets.additional.rate;
    income = taxBrackets.additional.threshold;
  }
  if (income > taxBrackets.higher.threshold) {
    tax += (income - taxBrackets.higher.threshold) * taxBrackets.higher.rate;
    income = taxBrackets.higher.threshold;
  }
  if (income > taxBrackets.basic.threshold) {
    tax += (income - taxBrackets.basic.threshold) * taxBrackets.basic.rate;
  }
  return tax;
};

const calculateNationalInsurance = (income) => {
  const niThreshold = 9568;
  const niRate = 0.12;
  return income > niThreshold ? (income - niThreshold) * niRate : 0;
};

export const calculateNetChange = (userData, pmPolicies) => {
  const { annualIncome } = userData;
  const income = Number(annualIncome);

  const baseTax = calculateIncomeTax(income);
  const baseNI = calculateNationalInsurance(income);

  const changes = pmPolicies.map(pm => {
    let netChange = 0;
    let taxBenefits = [];

    // Apply income tax changes
    if (pm.incomeTaxChange) {
      const newTax = calculateIncomeTax(income) + pm.incomeTaxChange(income);
      const taxDiff = baseTax - newTax;
      netChange += taxDiff;
      taxBenefits.push({
        name: "Income Tax",
        description: "Changes to income tax rates or thresholds",
        amount: Math.round(taxDiff)
      });
    }

    // Apply National Insurance changes
    if (pm.nationalInsuranceChange) {
      const newNI = calculateNationalInsurance(income) + pm.nationalInsuranceChange(income);
      const niDiff = baseNI - newNI;
      netChange += niDiff;
      taxBenefits.push({
        name: "National Insurance",
        description: "Changes to National Insurance contributions",
        amount: Math.round(niDiff)
      });
    }

    // Apply other policy changes
    if (pm.otherPolicies) {
      const otherChanges = pm.otherPolicies(userData);
      netChange += otherChanges.amount;
      taxBenefits.push(otherChanges);
    }

    return {
      name: pm.name,
      title: pm.title,
      netChange: Math.round(netChange),
      taxBenefits
    };
  });

  return changes;
};

// Remove or comment out the unused function
// function calculateTaxImpact({ income, /* age, dependents, studentsInCollege, */ capitalGains /*, dividends */ }) {
//   // Use the variables in your calculations or remove them if not needed
//   // ... rest of the function
// }