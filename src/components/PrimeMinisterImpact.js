import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { calculateNetChange } from '../lib/utils';

const PrimeMinister = ({ name, title, netChange, taxBenefits, detailedBreakdown }) => {
  const isPositive = netChange > 0;

  return (
    <Card className="w-full bg-white h-full">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl" 
             style={{ backgroundColor: name === "Keir Starmer" ? "#E11D48" : "#4B5563" }}>
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Net Change to Your Income</p>
          <p className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : '-'}£{Math.abs(netChange).toLocaleString()}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Tax Changes</h4>
          {taxBenefits.map((benefit, index) => (
            <div key={index} className="mb-2">
              <p className="font-semibold">{benefit.name}</p>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Detailed Breakdown</h4>
          {Object.entries(detailedBreakdown).map(([key, value]) => (
            <div key={key} className="mb-2">
              <p className="font-semibold">{key}</p>
              <p className="text-sm text-gray-600">£{value.toLocaleString()}</p>
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
      name: "Keir Starmer",
      title: "Labour Leader",
      incomeTaxChange: (income) => 0, // No change
      nationalInsuranceChange: (income) => 0, // No change
      taxBenefits: [
        { name: "Income Tax", description: "No increase in basic, higher, or additional rates" },
        { name: "National Insurance", description: "No increase planned" }
      ]
    },
    {
      name: "Rishi Sunak",
      title: "Current Prime Minister",
      incomeTaxChange: (income) => 0, // No change
      nationalInsuranceChange: (income) => -0.06 * income, // 6% reduction by 2027
      taxBenefits: [
        { name: "Income Tax", description: "No increase in rates" },
        { name: "National Insurance", description: "Cut employee NICs to 6% by April 2027" },
        { name: "Self-employed NICs", description: "Abolish main rate by end of Parliament" }
      ]
    }
  ];

  const impactData = calculateNetChange(userData, pmPolicies);

  return (
    <div className="bg-gray-50 shadow-lg rounded-3xl p-6 h-full overflow-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">Financial Impact of Prime Ministers' Policies</h2>
      <div className="grid grid-cols-2 gap-4">
        {impactData.map((pm, index) => (
          <PrimeMinister key={index} {...pm} />
        ))}
      </div>
    </div>
  );
};

export default PrimeMinisterImpact;