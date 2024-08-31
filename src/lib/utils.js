// src/lib/utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// 2019 baseline tax rates and thresholds
const BASELINE_2019 = {
  INCOME_TAX: {
    PERSONAL_ALLOWANCE: 12500,
    BASIC_RATE_LIMIT: 50000,
    HIGHER_RATE_LIMIT: 150000,
    BASIC_RATE: 0.20,
    HIGHER_RATE: 0.40,
    ADDITIONAL_RATE: 0.45
  },
  NIC: {
    PRIMARY_THRESHOLD: 8632,
    UPPER_EARNINGS_LIMIT: 50000,
    BASIC_RATE: 0.12,
    HIGHER_RATE: 0.02
  },
  DIVIDEND_TAX: {
    ALLOWANCE: 2000,
    BASIC_RATE: 0.075,
    HIGHER_RATE: 0.325,
    ADDITIONAL_RATE: 0.381
  },
  CAPITAL_GAINS_TAX: {
    ALLOWANCE: 12000,
    BASIC_RATE: 0.10,
    HIGHER_RATE: 0.20
  },
  CHILD_BENEFIT: {
    FIRST_CHILD: 20.70 * 52, // Weekly rate * 52 weeks
    ADDITIONAL_CHILD: 13.70 * 52
  }
};

const calculateBaselineTax = (income, dividends, capitalGains, dependents) => {
  let tax = 0;
  let nicTax = 0;
  let dividendTax = 0;
  let cgTax = 0;
  let childBenefit = 0;

  // Income Tax
  if (income > BASELINE_2019.INCOME_TAX.HIGHER_RATE_LIMIT) {
    tax += (income - BASELINE_2019.INCOME_TAX.HIGHER_RATE_LIMIT) * BASELINE_2019.INCOME_TAX.ADDITIONAL_RATE;
    tax += (BASELINE_2019.INCOME_TAX.HIGHER_RATE_LIMIT - BASELINE_2019.INCOME_TAX.BASIC_RATE_LIMIT) * BASELINE_2019.INCOME_TAX.HIGHER_RATE;
    tax += (BASELINE_2019.INCOME_TAX.BASIC_RATE_LIMIT - BASELINE_2019.INCOME_TAX.PERSONAL_ALLOWANCE) * BASELINE_2019.INCOME_TAX.BASIC_RATE;
  } else if (income > BASELINE_2019.INCOME_TAX.BASIC_RATE_LIMIT) {
    tax += (income - BASELINE_2019.INCOME_TAX.BASIC_RATE_LIMIT) * BASELINE_2019.INCOME_TAX.HIGHER_RATE;
    tax += (BASELINE_2019.INCOME_TAX.BASIC_RATE_LIMIT - BASELINE_2019.INCOME_TAX.PERSONAL_ALLOWANCE) * BASELINE_2019.INCOME_TAX.BASIC_RATE;
  } else if (income > BASELINE_2019.INCOME_TAX.PERSONAL_ALLOWANCE) {
    tax += (income - BASELINE_2019.INCOME_TAX.PERSONAL_ALLOWANCE) * BASELINE_2019.INCOME_TAX.BASIC_RATE;
  }

  // National Insurance Contributions
  if (income > BASELINE_2019.NIC.UPPER_EARNINGS_LIMIT) {
    nicTax += (income - BASELINE_2019.NIC.UPPER_EARNINGS_LIMIT) * BASELINE_2019.NIC.HIGHER_RATE;
    nicTax += (BASELINE_2019.NIC.UPPER_EARNINGS_LIMIT - BASELINE_2019.NIC.PRIMARY_THRESHOLD) * BASELINE_2019.NIC.BASIC_RATE;
  } else if (income > BASELINE_2019.NIC.PRIMARY_THRESHOLD) {
    nicTax += (income - BASELINE_2019.NIC.PRIMARY_THRESHOLD) * BASELINE_2019.NIC.BASIC_RATE;
  }

  // Dividend Tax
  if (dividends > BASELINE_2019.DIVIDEND_TAX.ALLOWANCE) {
    const taxableDividends = dividends - BASELINE_2019.DIVIDEND_TAX.ALLOWANCE;
    if (income > BASELINE_2019.INCOME_TAX.HIGHER_RATE_LIMIT) {
      dividendTax += taxableDividends * BASELINE_2019.DIVIDEND_TAX.ADDITIONAL_RATE;
    } else if (income > BASELINE_2019.INCOME_TAX.BASIC_RATE_LIMIT) {
      dividendTax += taxableDividends * BASELINE_2019.DIVIDEND_TAX.HIGHER_RATE;
    } else {
      dividendTax += taxableDividends * BASELINE_2019.DIVIDEND_TAX.BASIC_RATE;
    }
  }

  // Capital Gains Tax
  if (capitalGains > BASELINE_2019.CAPITAL_GAINS_TAX.ALLOWANCE) {
    const taxableGains = capitalGains - BASELINE_2019.CAPITAL_GAINS_TAX.ALLOWANCE;
    if (income > BASELINE_2019.INCOME_TAX.BASIC_RATE_LIMIT) {
      cgTax += taxableGains * BASELINE_2019.CAPITAL_GAINS_TAX.HIGHER_RATE;
    } else {
      cgTax += taxableGains * BASELINE_2019.CAPITAL_GAINS_TAX.BASIC_RATE;
    }
  }

  // Child Benefit
  if (dependents > 0) {
    childBenefit += BASELINE_2019.CHILD_BENEFIT.FIRST_CHILD;
    childBenefit += (dependents - 1) * BASELINE_2019.CHILD_BENEFIT.ADDITIONAL_CHILD;
    // High Income Child Benefit Charge
    if (income > 50000) {
      const chargeRate = Math.min((income - 50000) / 100 / 100, 1);
      childBenefit *= (1 - chargeRate);
    }
  }

  return { tax, nicTax, dividendTax, cgTax, childBenefit };
};

export const calculateNetChange = (userData, pmPolicies) => {
  const { annualIncome, dividends, capitalGains, dependents } = userData;
  const income = Number(annualIncome);
  const dividendsAmount = Number(dividends) || 0;
  const capitalGainsAmount = Number(capitalGains) || 0;
  const dependentsCount = Number(dependents) || 0;

  const baseline = calculateBaselineTax(income, dividendsAmount, capitalGainsAmount, dependentsCount);
  const baselineTotalTax = baseline.tax + baseline.nicTax + baseline.dividendTax + baseline.cgTax - baseline.childBenefit;

  return pmPolicies.map(pm => {
    const pmTax = pm.incomeTaxChange(income);
    const pmNIC = pm.nationalInsuranceChange(income);
    const pmDividendTax = pm.dividendTaxChange(dividendsAmount);
    const pmCapitalGainsChange = pm.capitalGainsChange(capitalGainsAmount);
    const pmDependentBenefit = pm.dependentBenefit(dependentsCount);

    const totalTaxUnderPM = baselineTotalTax + pmTax + pmNIC + pmDividendTax + pmCapitalGainsChange - pmDependentBenefit;
    const netChange = baselineTotalTax - totalTaxUnderPM;

    const detailedBreakdown = {
      "Income Tax Change": -pmTax,
      "NIC Change": -pmNIC,
      "Dividend Tax Change": -pmDividendTax,
      "Capital Gains Tax Change": -pmCapitalGainsChange,
      "Dependent Benefits": pmDependentBenefit
    };

    return {
      ...pm,
      netChange: Math.round(netChange),
      detailedBreakdown,
      taxBenefits: pm.taxBenefits
    };
  });
};