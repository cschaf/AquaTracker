import React, { useState, useEffect } from 'react';
import { useUseCases } from '../../app/use-case-provider';
import type { QuickAddValues } from '../../core/entities/quick-add-values';

const QuickAddSettings: React.FC = () => {
  const { getQuickAddValues, updateQuickAddValues } = useUseCases();
  const [values, setValues] = useState<QuickAddValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getQuickAddValues.execute().then((vals: QuickAddValues) => {
      setValues(vals);
      setIsLoading(false);
    });
  }, [getQuickAddValues]);

  const handleValueChange = (index: number, value: string) => {
    if (values) {
      const newValues = [...values] as QuickAddValues;
      newValues[index] = parseInt(value, 10) || 0;
      setValues(newValues);
    }
  };

  const handleSave = async () => {
    if (values) {
      try {
        await updateQuickAddValues.execute(values);
        alert('Quick add values updated successfully!');
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Add Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {values && values.map((value, index) => (
          <div key={index}>
            <label htmlFor={`quick-add-${index}`} className="block text-sm font-medium text-gray-700">
              Value {index + 1}
            </label>
            <input
              type="number"
              id={`quick-add-${index}`}
              name={`quick-add-${index}`}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={value}
              onChange={(e) => handleValueChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default QuickAddSettings;
