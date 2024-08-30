import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { calculateNetChange } from '../lib/utils';

const PrimeMinister = ({ name, title, netChange, taxBenefits }) => {
  const isPositive = netChange > 0;

  return (
    <Card className="w-full max-w-md mx-auto mb-6 bg-white">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Net Change to Your Income (2023)</p>
          <p className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : '-'}£{Math.abs(netChange).toLocaleString()}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Tax Benefits</h4>
          {taxBenefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-4 mb-2">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="10" />
                  <text x="50" y="50" textAnchor="middle" dy=".3em" className="text-xl font-bold fill-green-600">+£{(benefit.amount / 1000).toFixed(1)}k</text>
                </svg>
              </div>
              <div>
                <p className="font-semibold">{benefit.name}</p>
                <p className="text-sm text-gray-600">{benefit.description}</p>
                <p className="text-green-600 font-semibold">+£{benefit.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const PrimeMinisterImpact = ({ userData }) => {
  const pmPolicies = [
    {
      name: "Rishi Sunak",
      title: "Current Prime Minister",
      incomeTaxChange: (income) => -0.01 * income, // 1% income tax cut
      nationalInsuranceChange: (income) => -0.02 * income, // 2% NI cut
    },
    {
      name: "Liz Truss",
      title: "Former Prime Minister",
      incomeTaxChange: (income) => -0.02 * income, // 2% income tax cut
      otherPolicies: (userData) => ({
        name: "Corporation Tax",
        description: "Cancellation of planned corporation tax rise",
        amount: userData.dividends * 0.05 // 5% benefit on dividends
      })
    },
    {
      name: "Boris Johnson",
      title: "Former Prime Minister",
      nationalInsuranceChange: (income) => 0.01 * income, // 1% NI increase
      otherPolicies: (userData) => ({
        name: "COVID-19 Support",
        description: "Additional support for families during pandemic",
        amount: userData.dependents * 500 // £500 per dependent
      })
    }
  ];

  const impactData = calculateNetChange(userData, pmPolicies);

  return (
    <div className="bg-gray-50 shadow-lg rounded-3xl p-6 h-full overflow-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">Financial Impact of Prime Ministers' Policies</h2>
      <div className="space-y-6">
        {impactData.map((pm, index) => (
          <PrimeMinister key={index} {...pm} />
        ))}
      </div>
    </div>
  );
};

export default PrimeMinisterImpact;