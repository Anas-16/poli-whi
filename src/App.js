import React, { useState } from 'react';
import DemographicFinancialForm from './components/DemographicFinancialForm';
import PrimeMinisterImpact from './components/PrimeMinisterImpact';

function App() {
  const [userData, setUserData] = useState(null);

  const handleFormSubmit = (formData) => {
    setUserData(formData);
  };

  return (
    <div className="min-h-screen bg-gray-300 p-6 flex flex-col sm:flex-row items-start justify-center gap-6">
      <div className="w-full sm:w-1/2 max-w-xl">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative bg-gray-50 shadow-lg sm:rounded-3xl p-6">
            <h1 className="text-2xl font-semibold text-center mb-6">Demographic and Financial Information</h1>
            <DemographicFinancialForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </div>
      <div className="w-full sm:w-1/2 max-w-xl">
        {userData && <PrimeMinisterImpact userData={userData} />}
      </div>
    </div>
  );
}

export default App;