import React, { useState, useEffect } from 'react';
import { useUseCases } from '../../app/use-case-provider';
import type { QuickAddValues } from '../../core/entities/quick-add-values';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';

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
    <Card>
      <h3 className="text-xl font-bold text-text-primary mb-4">Quick Add Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {values && values.map((value, index) => (
          <div key={index}>
            <label htmlFor={`quick-add-${index}`} className="block text-sm font-medium text-text-secondary">
              Value {index + 1}
            </label>
            <input
              type="number"
              id={`quick-add-${index}`}
              name={`quick-add-${index}`}
              className="mt-1 block w-full p-2 border border-border-card bg-bg-tertiary rounded-md shadow-sm focus:ring-accent-primary focus:border-accent-primary"
              value={value}
              onChange={(e) => handleValueChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </Card>
  );
};

export default QuickAddSettings;
