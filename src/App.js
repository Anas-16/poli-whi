import React, { useState } from 'react';
import DemographicFinancialForm from './components/DemographicFinancialForm';
import PrimeMinisterImpact from './components/PrimeMinisterImpact';

function App() {
  const [userData, setUserData] = useState(null);

  const handleFormSubmit = (formData) => {
    setUserData(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Tax Impact Calculator</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <DemographicFinancialForm onSubmit={handleFormSubmit} />
          </div>
          <div>
            {userData && <PrimeMinisterImpact userData={userData} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;