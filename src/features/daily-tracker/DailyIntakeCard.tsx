import React, { useState, useEffect, useCallback } from 'react';
import { useUseCases } from '../../app/use-case-provider';
import type { QuickAddValues } from '../../core/entities/quick-add-values';
import { eventBus } from '../../app/event-bus';
import { checkWaterIntake, INTAKE_STATUS } from '../../shared/lib/intakeWarnings';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { ProgressBar } from '../../shared/components/ProgressBar';

interface DailyIntakeCardProps {
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  addWaterEntry: (amount: number) => void;
  dailyTotal: number;
}

const DailyIntakeCard: React.FC<DailyIntakeCardProps> = ({ dailyGoal, setDailyGoal, addWaterEntry, dailyTotal }) => {
  const [customAmount, setCustomAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { getQuickAddValues } = useUseCases();
  const [quickAddValues, setQuickAddValues] = useState<QuickAddValues | null>(null);

  const fetchQuickAddValues = useCallback(() => {
    getQuickAddValues.execute().then(setQuickAddValues);
  }, [getQuickAddValues]);

  useEffect(() => {
    fetchQuickAddValues();
    eventBus.on('quickAddValuesChanged', fetchQuickAddValues);

    return () => {
      eventBus.off('quickAddValuesChanged', fetchQuickAddValues);
    };
  }, [fetchQuickAddValues]);

  const displayPercentage = dailyGoal > 0 ? (dailyTotal / dailyGoal) * 100 : 0;
  const progressPercentage = Math.min(displayPercentage, 100);
  const intakeStatus = checkWaterIntake(dailyTotal).status;
  const isCritical = intakeStatus === INTAKE_STATUS.CRITICAL;

  const handleAddCustom = () => {
    const amount = parseInt(customAmount);

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a positive number.');
      return;
    }

    if (amount > 5000) {
      setError('Amount cannot be greater than 5000.');
      return;
    }

    setError(null);
    addWaterEntry(amount);
    setCustomAmount('');
  };

  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = now.toLocaleDateString('en-US', options);

  const getIconForValue = (value: number) => {
    if (value <= 300) return 'fas fa-glass-whiskey';
    if (value <= 750) return 'fas fa-wine-bottle';
    return 'fas fa-prescription-bottle';
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-text-primary">Today's Intake</h2>
        <div className="flex items-center bg-bg-tertiary rounded-full px-3 py-1 text-sm">
          <i className="fas fa-calendar-alt text-text-secondary mr-2"></i>
          <span className="font-medium text-text-secondary">{currentDate}</span>
        </div>
      </div>

      <div className="bg-bg-primary rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-text-primary">{dailyTotal}</span>
            <span className="text-lg text-text-secondary ml-1">ml</span>
          </div>
          <div className="flex items-baseline">
            <input
              type="number"
              className="w-24 text-lg font-bold text-text-primary text-right bg-transparent focus:outline-none"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(parseInt(e.target.value))}
            />
            <span className="text-lg text-text-secondary ml-1">ml Goal</span>
          </div>
        </div>
        <ProgressBar value={dailyTotal} max={dailyGoal} />
        <div className="mt-2 flex justify-between text-xs text-text-secondary">
          <span>0%</span>
          <span>{Math.round(displayPercentage)}%</span>
          <span>100%</span>
        </div>
      </div>

      <div>
        <p className="text-md font-semibold text-text-primary mb-2">Quick Add</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {quickAddValues ? (
            quickAddValues.map((value, index) => (
              <Button
                key={index}
                onClick={() => addWaterEntry(value)}
                disabled={isCritical}
                className="bg-bg-secondary text-text-primary py-3 text-sm flex items-center justify-center"
              >
                <i className={`${getIconForValue(value)} text-lg mr-2`}></i>
                <span>{value >= 1000 ? `${value / 1000}L` : `${value} ml`}</span>
              </Button>
            ))
          ) : (
            <div>Loading quick add values...</div>
          )}
        </div>

        <p className="text-md font-semibold text-text-primary mb-2">Custom Amount</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Enter amount in ml"
            disabled={isCritical}
            className="flex-1 p-3 border border-border-card bg-bg-primary rounded-lg focus:outline-none focus:border-accent-primary transition w-full disabled:opacity-50 text-text-primary placeholder:text-text-secondary"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              if (error) {
                setError(null);
              }
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
          />
          <Button
            onClick={handleAddCustom}
            disabled={isCritical}
          >
            <i className="fas fa-plus mr-2"></i>Add
          </Button>
        </div>
        {error && <p className="text-warning text-sm mt-2">{error}</p>}
      </div>
    </Card>
  );
};

export default DailyIntakeCard;
