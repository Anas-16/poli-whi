import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";

const DemographicFinancialForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    filingStatus: '',
    annualIncome: '',
    age: '',
    dependents: '',
    dividends: '',
    capitalGains: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.filingStatus) newErrors.filingStatus = 'Filing status is required';
    if (!formData.annualIncome) newErrors.annualIncome = 'Annual income is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.dependents) newErrors.dependents = 'Number of dependents is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Demographic and Financial Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="filingStatus">Filing Status</Label>
            <Select name="filingStatus" onValueChange={(value) => handleSelectChange('filingStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select filing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="headOfHousehold">Head of Household</SelectItem>
              </SelectContent>
            </Select>
            {errors.filingStatus && <p className="text-red-500 text-sm">{errors.filingStatus}</p>}
          </div>

          <div>
            <Label htmlFor="annualIncome">Annual Income (GBP)</Label>
            <Input
              type="number"
              id="annualIncome"
              name="annualIncome"
              value={formData.annualIncome}
              onChange={handleChange}
              placeholder="Enter annual income"
            />
            {errors.annualIncome && <p className="text-red-500 text-sm">{errors.annualIncome}</p>}
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>

          <div>
            <Label htmlFor="dependents">Number of Dependents</Label>
            <Input
              type="number"
              id="dependents"
              name="dependents"
              value={formData.dependents}
              onChange={handleChange}
              placeholder="Enter number of dependents"
            />
            {errors.dependents && <p className="text-red-500 text-sm">{errors.dependents}</p>}
          </div>

          <div>
            <Label htmlFor="dividends">Dividends (GBP)</Label>
            <Input
              type="number"
              id="dividends"
              name="dividends"
              value={formData.dividends}
              onChange={handleChange}
              placeholder="Enter dividends"
            />
          </div>

          <div>
            <Label htmlFor="capitalGains">Capital Gains (GBP)</Label>
            <Input
              type="number"
              id="capitalGains"
              name="capitalGains"
              value={formData.capitalGains}
              onChange={handleChange}
              placeholder="Enter capital gains"
            />
          </div>

          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DemographicFinancialForm;