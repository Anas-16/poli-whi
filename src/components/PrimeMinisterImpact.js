import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { calculateNetChange } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';

const PrimeMinister = ({ name, title, netChange, taxBenefits, detailedBreakdown }) => {
  const isPositive = netChange > 0;
  const absNetChange = Math.abs(netChange);

  const pieData = [
    { name: 'Income Tax', value: detailedBreakdown['Income Tax Change'] },
    { name: 'National Insurance', value: detailedBreakdown['NIC Change'] },
    { name: 'Dividends', value: detailedBreakdown['Dividend Tax Change'] },
    { name: 'Capital Gains', value: detailedBreakdown['Capital Gains Tax Change'] },
    { name: 'Dependents', value: detailedBreakdown['Dependent Benefits'] },
  ];

  const COLORS = ['#4ade80', '#60a5fa', '#f59e0b', '#ef4444', '#9333ea'];

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {`${payload.name}: £${Math.abs(value).toLocaleString()}`}
        </text>
      </g>
    );
  };

  return (
    <Card className="w-full bg-white h-full">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl" 
             style={{ backgroundColor: name === "Jeremy Corbyn" ? "#E11D48" : "#4B5563" }}>
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">Net Change to Your Income (2015)</p>
        <p className={`text-6xl font-bold mb-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : '-'}${absNetChange.toLocaleString()}
        </p>
        <div className="flex justify-between items-center">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={0}
                  activeShape={renderActiveShape}
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Tax Benefits</h4>
          {taxBenefits.map((benefit, index) => (
            <div key={index} className="mb-2">
              <p className="font-semibold">{benefit.name}</p>
              <p className="text-sm text-gray-600">{benefit.description}</p>
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
      name: "Jeremy Corbyn",
      title: "Former Labour Leader",
      incomeTaxChange: (income) => {
        let additionalTax = 0;
        if (income > 125000) {
          additionalTax += (income - 125000) * 0.05;
          additionalTax += (125000 - 80000) * 0.05;
        } else if (income > 80000) {
          additionalTax += (income - 80000) * 0.05;
        }
        return additionalTax;
      },
      nationalInsuranceChange: (income) => 0, // No specific NI changes
      dividendTaxChange: (dividends) => {
        // Align dividend tax rates with income tax rates (simplified)
        return dividends * 0.075; // Assuming 7.5% increase on average
      },
      capitalGainsChange: (gains) => gains * 0.1, // Assuming 10% increase on average
      dependentBenefit: (dependents) => dependents * 104, // £2 per week per dependent
      taxBenefits: [
        { name: "Income Tax", description: "New 45% rate above £80,000 and 50% above £125,000" },
        { name: "Dividends", description: "Increased tax rates on dividends" },
        { name: "Capital Gains", description: "Aligned with income tax rates" },
        { name: "Dependents", description: "Increased Child Benefit by £2 per week" }
      ]
    },
    {
      name: "Boris Johnson",
      title: "Former Prime Minister",
      incomeTaxChange: (income) => 0, // No immediate changes to income tax
      nationalInsuranceChange: (income) => {
        // Increase NI threshold from £8,632 to £9,500
        const oldNIC = Math.max(0, (Math.min(income, 50000) - 8632) * 0.12 + Math.max(0, income - 50000) * 0.02);
        const newNIC = Math.max(0, (Math.min(income, 50000) - 9500) * 0.12 + Math.max(0, income - 50000) * 0.02);
        return newNIC - oldNIC; // This will be negative, representing a tax cut
      },
      dividendTaxChange: (dividends) => 0, // No changes to dividend tax
      capitalGainsChange: (gains) => 0, // No changes to capital gains tax
      dependentBenefit: (dependents) => 0, // No specific dependent benefits
      taxBenefits: [
        { name: "National Insurance", description: "Increased threshold to £9,500" },
        { name: "Income Tax", description: "Aim to raise higher rate threshold to £80,000 in future" },
        { name: "Pensions", description: "Maintained 'triple lock' on state pensions" }
      ]
    }
  ];

  const impactData = calculateNetChange(userData, pmPolicies);

  return (
    <div className="bg-gray-50 shadow-lg rounded-3xl p-6 h-full overflow-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">Financial Impact of Prime Ministers' Policies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {impactData.map((pm, index) => (
          <PrimeMinister key={index} {...pm} />
        ))}
      </div>
    </div>
  );
};

export default PrimeMinisterImpact;