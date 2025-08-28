import React, { useState, useEffect, useCallback } from 'react';
import { useUseCases } from '../../app/use-case-provider';
import type { QuickAddValues } from '../../core/entities/quick-add-values';
import { eventBus } from '../../app/event-bus';

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

  const percentage = dailyGoal > 0 ? Math.min((dailyTotal / dailyGoal) * 100, 100) : 0;

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
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden drop-shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Today's Intake</h2>
          <div className="relative">
            <div className="flex items-center bg-blue-50 rounded-full px-4 py-2">
              <i className="fas fa-calendar-alt text-blue-500 mr-2"></i>
              <span className="font-medium text-gray-700">{currentDate}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-blue-600">{dailyTotal}</span>
              <span className="text-xl text-gray-500 ml-1">ml</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-xl text-gray-500 mr-1">/</span>
              <input
                type="number"
                className="goal-input w-24 text-xl font-bold text-gray-700 text-center rounded-lg py-1 px-2 focus:outline-none"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(parseInt(e.target.value))}
              />
              <span className="text-xl text-gray-500 ml-1">ml</span>
            </div>
          </div>

          <div className="water-progress h-8 rounded-full overflow-hidden relative">
            <div className="water-level h-full" style={{ width: `${percentage}%` }}></div>
            <div className="water-bubble"></div>
            <div className="water-bubble"></div>
            <div className="water-bubble"></div>
            <div className="water-bubble"></div>
            <div className="water-bubble"></div>
          </div>

          <div className="mt-3 flex justify-between text-sm text-gray-500">
            <span>0%</span>
            <span>{Math.round(percentage)}%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-lg font-semibold text-gray-700 mb-4">Quick Add</p>
          <div className="grid grid-cols-3 gap-3">
            {quickAddValues ? (
              quickAddValues.map((value, index) => (
                <button
                  key={index}
                  onClick={() => addWaterEntry(value)}
                  className="quick-add bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <i className={`${getIconForValue(value)} text-xl mb-1`}></i>
                  <span>{value >= 1000 ? `${value / 1000}L` : `${value} ml`}</span>
                </button>
              ))
            ) : (
              <div>Loading quick add values...</div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-700 mb-3">Custom Amount</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              placeholder="Enter amount in ml"
              className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition w-full"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                if (error) {
                  setError(null);
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
            />
            <button
              onClick={handleAddCustom}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              <i className="fas fa-plus mr-2"></i>Add
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default DailyIntakeCard;
