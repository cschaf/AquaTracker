import React, { useState, useEffect, useCallback } from 'react';
import { useUseCases } from '../../app/use-case-provider';
import type { QuickAddValues } from '../../core/entities/quick-add-values';
import { eventBus } from '../../app/event-bus';
import { checkWaterIntake, INTAKE_STATUS } from '../../shared/lib/intakeWarnings';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';

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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Today's Intake</h2>
          <div className="relative">
            <div className="flex items-center bg-bg-secondary rounded-full px-4 py-2">
              <i className="fas fa-calendar-alt text-text-primary mr-2"></i>
              <span className="font-medium text-text-primary">{currentDate}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-text-primary">{dailyTotal}</span>
              <span className="text-xl text-text-secondary ml-1">ml</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-xl text-text-secondary mr-1">/</span>
              <input
                type="number"
                className="goal-input w-24 text-xl font-bold text-text-primary text-center rounded-lg py-1 px-2 focus:outline-none bg-bg-secondary"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(parseInt(e.target.value))}
              />
              <span className="text-xl text-text-secondary ml-1">ml</span>
            </div>
          </div>

          <div className="water-progress h-8 rounded-full overflow-hidden relative bg-bg-secondary">
            <div
              className={`water-level h-full bg-primary ${displayPercentage > 100 ? 'water-level-over-goal' : ''}`}
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
            <div className="water-bubble"></div>
            <div className="water-bubble"></div>
            <div className="water-bubble"></div>
            <div className="water-bubble"></div>
            <div className="water-bubble"></div>
          </div>

          <div className="mt-3 flex justify-between text-sm text-text-secondary">
            <span>0%</span>
            <span>{Math.round(displayPercentage)}%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-lg font-semibold text-text-primary mb-4">Quick Add</p>
          <div className="grid grid-cols-3 gap-3">
            {quickAddValues ? (
              quickAddValues.map((value, index) => (
                <Button
                  key={index}
                  onClick={() => addWaterEntry(value)}
                  disabled={isCritical}
                >
                  <i className={`${getIconForValue(value)} text-xl mb-1`}></i>
                  <span>{value >= 1000 ? `${value / 1000}L` : `${value} ml`}</span>
                </Button>
              ))
            ) : (
              <div>Loading quick add values...</div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg font-semibold text-text-primary mb-3">Custom Amount</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              placeholder="Enter amount in ml"
              disabled={isCritical}
              className="flex-1 p-4 border-2 border-border-card bg-bg-primary rounded-xl focus:outline-none focus:border-primary transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
          {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        </div>
      </div>
    </Card>
  );
};

export default DailyIntakeCard;
